import re
import os
import json
import gc
from time import time

import torch
from datasets import Dataset, DatasetDict
from huggingface_hub import login
from transformers import AutoModelForCausalLM, AutoTokenizer, PreTrainedTokenizer, TrainingArguments, TrainerCallback, TrainerState, TrainerControl
from trl import SFTTrainer

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

    def __load_config_json(self):
        with open(Config.config_json, "r") as file:
            contents = file.read()
            self.config = ConfigJson(json.loads(contents))

    def __detect_device(self):
        # Force CPU usage only
        self.device = torch.device("cpu")

    def __hf_login(self):
        login(self.config.hf_token)

    def __load_chat_tokenizer(self):
        self.tokenizer = AutoTokenizer.from_pretrained(self.config.model)
        self.tokenizer.padding_side = "right"  # Set padding side to right

    def __load_chat_model(self):
        print(f"\n## Loading Model: {self.config.model}\n")

        self.model = AutoModelForCausalLM.from_pretrained(
            self.config.model,
            torch_dtype=torch.float32,  # Use float32 since we're on CPU
            low_cpu_mem_usage=True,
        )

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

        gc.collect()

    def load(self):
        self.__cleanup()

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
            padding=True,
            truncation=True,
            max_length=1024
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
        self.tokenizer.padding_side = "right"

    def __load_train_model(self):
        print(f"\n## Loading Model: {self.config.source_model}\n")
        self.model = AutoModelForCausalLM.from_pretrained(
            self.config.source_model,
            device_map={"": "cpu"},  # Force CPU usage
            low_cpu_mem_usage=True,
        )
        print(f"\n## Loaded Model: {self.config.source_model}\n")
        self.model.config.use_cache = False
        self.model.config.pretraining_tp = 1

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
                    padding="max_length",
                    truncation=True,
                    max_length=self.config.train_max_length
                )

                notPadded = self.tokenizer.apply_chat_template(
                    lesson["messages"],
                    return_tensors="pt",
                    return_dict=True
                )

                input_ids_length = len(notPadded["input_ids"].squeeze(0).tolist())

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
                    "input_ids": tokenized["input_ids"].squeeze(0).tolist(),
                    "attention_mask": tokenized["attention_mask"].squeeze(0).tolist()
                })

        for msg in messages:
            assert len(msg["input_ids"]) == self.config.train_max_length, "Inconsistent input_id length"
            assert len(msg["attention_mask"]) == self.config.train_max_length, "Inconsistent attention_mask length"

        dataset = Dataset.from_dict({
            "input_ids": [msg["input_ids"] for msg in messages],
            "attention_mask": [msg["attention_mask"] for msg in messages]
        })

        dataset_dict = DatasetDict({"train": dataset})

        print(f"Longest prompt has {max_token_count} tokens.")

        return dataset_dict

    def __train_dataset(self, dataset):
        training_arguments = TrainingArguments(
            output_dir=self.config.train_output_dir,
            per_device_train_batch_size=1,
            optim="adamw_hf",  # Updated optimizer
            learning_rate=1e-4,
            num_train_epochs=100,
            logging_strategy="epoch",
            fp16=False,  # Disable mixed precision since we're on CPU
        )

        trainer = SFTTrainer(
            model=self.model,
            train_dataset=dataset["train"],
            tokenizer=self.tokenizer,
            args=training_arguments,
            max_seq_length=self.config.train_max_length,
            dataset_text_field="input_ids"
        )

        trainer.add_callback(EarlyStoppingCallback())

        print("\n## Starting Training\n")
        trainer.train()
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