import re
import os
import json
import gc
from time import time

import torch
from datasets import Dataset, DatasetDict
from huggingface_hub import login
from peft import prepare_model_for_kbit_training, get_peft_model, LoraConfig, PeftModel, PeftConfig
from transformers import AutoModelForCausalLM, AutoTokenizer, PreTrainedTokenizer, BitsAndBytesConfig, TrainingArguments, TrainerCallback, TrainerState, TrainerControl
from trl import SFTTrainer
import bitsandbytes

from config import Config
from logic.filehelper import FileHelper
from model.config_json import ConfigJson


class Aici:
    config: ConfigJson
    tokenizer: PreTrainedTokenizer = None
    model: AutoModelForCausalLM = None
    device: torch.device
    sourceModel: AutoModelForCausalLM = None
    targetModel: AutoModelForCausalLM = None
    peft_config: LoraConfig = None

    def __load_config_json(self):
        with open(Config.config_json, "r") as file:
            contents = file.read()
            self.config = ConfigJson(json.loads(contents))

    def __detect_device(self):
        if torch.cuda.is_available():
            self.device = torch.device("cuda")  # NVIDIA CUDA
            torch.cuda.set_per_process_memory_fraction(0.75)
        elif torch.backends.mps.is_available():
            self.device = torch.device("mps")  # Apple M1/M2 GPUs
        else:
            self.device = torch.device("cpu")  # Fallback to CPU

    def __hf_login(self):
        login(self.config.hf_token)

    def __load_chat_tokenizer(self):
        self.tokenizer = AutoTokenizer.from_pretrained(self.config.model)
        self.tokenizer.padding_side = "right"  # Set padding side to right

    def __load_chat_model(self):
        print(f"\n## Loading Model: {self.config.model}\n")

        self.model = AutoModelForCausalLM.from_pretrained(
            self.config.model,
            torch_dtype=torch.float16,
            low_cpu_mem_usage=True,
        )

        if torch.cuda.device_count() > 1:
            self.model = torch.nn.DataParallel(self.model)

        self.model.gradient_checkpointing_enable()

        print(f"\n## Loaded Model: {self.config.model}\n")

    def __cleanup(self):
        print(f"\n## Cleanup\n")
        if self.model is not None:
            del self.model
        if self.tokenizer is not None:
            del self.tokenizer

        if self.sourceModel is not None:
            del self.sourceModel
        if self.targetModel is not None:
            del self.targetModel
        if self.peft_config is not None:
            del self.peft_config

        torch.cuda.empty_cache()
        gc.collect()

    def load(self):
        self.__cleanup()

        os.environ["PYTORCH_CUDA_ALLOC_CONF"] = "expandable_segments:True"

        self.__load_config_json()
        self.__detect_device()
        self.__hf_login()
        self.__load_chat_tokenizer()
        self.__load_chat_model()

    def chat(self, messages):
        input_ids = self.tokenizer.apply_chat_template(
            messages,
            return_tensors="pt",
            return_dict=True,
            add_generation_prompt=True,
            padding=True,  # Ensure padding
            truncation=True,  # Ensure truncation
            max_length=1024  # Adjust max length to match model
        ).to(self.device)

        start_time = time()
        outputs = self.model.generate(**input_ids, max_new_tokens=self.config.max_new_tokens)
        end_time = time()

        input_token_count = input_ids['input_ids'].size(-1)
        output_token_count = outputs.size(-1)

        decoded = self.tokenizer.decode(outputs[0])
        regex = re.compile(self.config.message_regex)
        matches = re.findall(regex, decoded)
        lastMatch = matches[-1]

        return {
            "inputTokens": input_token_count,
            "outputTokens": output_token_count,
            "seconds": end_time - start_time,
            "message": {"role": "assistant", "content": lastMatch[1].strip()}
        }

    def __load_train_tokenizer(self):
        self.tokenizer = AutoTokenizer.from_pretrained(
            self.config.source_model,
            trust_remote_code=True
        )
        self.tokenizer.padding_side = "right"  # Set padding side to right

    def __load_train_model(self):
        bnb_config = BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_quant_type="nf4",
            bnb_4bit_compute_dtype="float16",
            bnb_4bit_use_double_quant=True,
        )

        print(f"\n## Loading Model: {self.config.source_model}\n")
        if torch.cuda.is_available() or torch.backends.mps.is_available():
            self.model = AutoModelForCausalLM.from_pretrained(
				self.config.source_model,
				attn_implementation='eager',
				device_map="auto",
				quantization_config=bnb_config,
                low_cpu_mem_usage=True,
			)
        else:
            print("No GPU available, loading model without quantization.")
            self.model = AutoModelForCausalLM.from_pretrained(
				self.config.source_model,
				attn_implementation='eager',
				device_map="auto",
				torch_dtype=torch.float16,  # or float32 if memory is a concern
                low_cpu_mem_usage=True,
			)
        print(f"\n## Loaded Model: {self.config.source_model}\n")
        self.model.config.use_cache = False
        self.model.config.pretraining_tp = 1

        self.model.gradient_checkpointing_enable()

        cls = bitsandbytes.nn.Linear4bit
        lora_modules_names = set()
        for name, module in self.model.named_modules():
            if isinstance(module, cls):
                names = name.split(".")
                lora_modules_names.add(names[0] if len(names) == 1 else names[-1])
        if "lm_head" in lora_modules_names:
            lora_modules_names.remove("lm_head")
        target_modules = list(lora_modules_names)

        self.peft_config = LoraConfig(
            lora_alpha=16,
            lora_dropout=0.05,
            r=4,
            bias="none",
            task_type=self.config.task_type,
            target_modules=target_modules
        )
        self.model = prepare_model_for_kbit_training(self.model)
        self.model = get_peft_model(self.model, self.peft_config)

    def __load_dataset(self):
        self.__load_train_tokenizer()

        files = FileHelper().list(Config.datasets_dir, ".ds.json")

        messages = []
        max_token_count = 0

        for file in files:
            contents = FileHelper().read(Config.datasets_dir + "/" + file + ".ds.json")
            jsonContents = json.loads(contents)
            for lesson in jsonContents["lessons"]:
                tokenized = self.tokenizer.apply_chat_template(
                    lesson["messages"],
                    return_tensors="pt",
                    return_dict=True,
                    padding="max_length",  # Ensure padding to max length
                    truncation=True,
                    max_length=self.config.train_max_length  # Ensure consistent max length
                )

                notPadded = self.tokenizer.apply_chat_template(
                    lesson["messages"],
                    return_tensors="pt",
                    return_dict=True
                )

                input_ids_length = len(notPadded["input_ids"].squeeze(0).tolist())

                # Check for the longest prompt
                if input_ids_length > max_token_count:
                    max_token_count = input_ids_length

                if input_ids_length > self.config.train_max_length:
                    error_message = (
                        f"Error: The tokenized sequence length {input_ids_length} exceeds "
                        f"the maximum allowed length of {self.config.train_max_length}. "
                        f"Truncation occurred in file '{file}'."
                    )
                    print(error_message)
                    raise ValueError(error_message)

                messages.append({
                    "input_ids": tokenized["input_ids"].squeeze(0).tolist(),  # Flatten tensor to list
                    "attention_mask": tokenized["attention_mask"].squeeze(0).tolist()  # Flatten tensor to list
                })

        # Validate that all input_ids and attention_mask lists have the same length
        for msg in messages:
            assert len(msg["input_ids"]) == self.config.train_max_length, "Inconsistent input_id length"
            assert len(msg["attention_mask"]) == self.config.train_max_length, "Inconsistent attention_mask length"

        dataset = Dataset.from_dict({
            "input_ids": [msg["input_ids"] for msg in messages],
            "attention_mask": [msg["attention_mask"] for msg in messages]
        })

        dataset_dict = DatasetDict({"train": dataset})

        # Log the longest prompt and its token count
        print(f"Longest prompt has {max_token_count} tokens.")

        return dataset_dict

    def __train_dataset(self, dataset):
        training_arguments = TrainingArguments(
            output_dir=self.config.train_output_dir,
            per_device_train_batch_size=1,  # Adjusted batch size
            #gradient_accumulation_steps=4,  # Adjusted gradient accumulation
            #optim="paged_adamw_32bit",
            #learning_rate=1e-5,  # Lowered learning rate
            #lr_scheduler_type="cosine",
            num_train_epochs=self.config.epochs,  # Increased number of epochs
            #logging_steps=1  # Log every step
            logging_strategy="epoch",  # Log once per epoch
            fp16=True,  # Disable mixed precision temporarily
            fp16_opt_level="O2",
            #gradient_checkpointing=True
        )

        torch.cuda.empty_cache()

        trainer = SFTTrainer(
            model=self.model,
            train_dataset=dataset["train"],
            tokenizer=self.tokenizer,
            args=training_arguments,
            peft_config=self.peft_config,
            max_seq_length=self.config.train_max_length,  # Use max_seq_length directly
            dataset_text_field="input_ids"  # Use input_ids directly
        )

        # Add the EarlyStoppingCallback
        trainer.add_callback(EarlyStoppingCallback())

        print("\n## Starting Training\n")
        trainer.train()
        torch.cuda.empty_cache()
        print("\n## Finished Training\n")
        
        print("\n## Starting Merge\n")
        self.model = self.model.merge_and_unload()
        print("\n## Finished Merge\n")

        epoch_output = f"{self.config.target_model}"
        print(f"\n## Saving: {epoch_output}\n")
        self.tokenizer.save_pretrained(epoch_output)
        self.model.save_pretrained(epoch_output)

    def train(self):
        os.environ["WANDB_MODE"] = "offline"

        self.__cleanup()
        
        self.__load_config_json()
        self.__detect_device()
        self.__hf_login()

        self.__load_train_tokenizer()
        self.__load_train_model()

        dataset = self.__load_dataset()
        self.__train_dataset(dataset)
        
    def push_to_hub(self):
        self.__load_config_json()
        self.__detect_device()
        self.__hf_login()

        self.model.push_to_hub(self.config.push_to_model)
        self.tokenizer.push_to_hub(self.config.push_to_model)


class EarlyStoppingCallback(TrainerCallback):
    def __init__(self):
        with open(Config.config_json, "r") as file:
            contents = file.read()
            self.config = ConfigJson(json.loads(contents))

    def on_log(self, args, state: TrainerState, control: TrainerControl, logs=None, **kwargs):
        if logs is not None and 'loss' in logs and logs['loss'] <= self.config.target_loss:
            print(f"\n## Early stopping triggered. Loss: {logs['loss']} <= {self.config.target_loss}\n")
            control.should_training_stop = True

    def on_step_end(self, args, state: TrainerState, control: TrainerControl, **kwargs):
        if len(state.log_history) > 0 and state.log_history[-1].get("loss", None) is not None:
            current_loss = state.log_history[-1]["loss"]
            if current_loss <= self.config.target_loss:
                print(f"\n## Early stopping triggered. Loss: {current_loss} <= {self.config.target_loss}\n")
                control.should_training_stop = True