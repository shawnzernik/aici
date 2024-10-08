from datetime import datetime
import warnings

# Suppress all warnings
warnings.filterwarnings("ignore")

import multiprocessing
from typing import Optional
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

os.environ["PYTORCH_CUDA_ALLOC_CONF"] = "expandable_segments:True"

num_cpus = multiprocessing.cpu_count()
print(f"## Number of CPUs: {num_cpus}")
os.environ['OMP_NUM_THREADS'] = str(num_cpus)
os.environ['MKL_NUM_THREADS'] = str(num_cpus)
torch.set_num_threads(num_cpus)

class Aici:
    config: ConfigJson = None
    tokenizer: PreTrainedTokenizer = None
    model: AutoModelForCausalLM = None
    device: torch.device = None
    max_length = 0

    def __cleanup(self):
        print("## Aici.__cleanup()")

        if self.model is not None:
            del self.model
        if self.tokenizer is not None:
            del self.tokenizer
        if self.config is not None:
            del self.config
        if self.device is not None:
            if(self.device.type == "cuda"):
                torch.cuda.empty_cache()            
            del self.device

        gc.collect()

    def __load_config(self):
        print("## Aici.__load_config()")

        if torch.cuda.is_available():
            self.device = torch.device("cuda")  # NVIDIA CUDA
        elif torch.backends.mps.is_available():
            self.device = torch.device("mps")  # Apple M1/M2 GPUs
        else:
            self.device = torch.device("cpu")  # Fallback to CPU
        
        with open(Config.config_json, "r") as file:
            contents = file.read()
            self.config = ConfigJson(json.loads(contents))

    def __load_tokenizer(self):
        print("## Aici.__load_tokenizer()")
        
        self.tokenizer = AutoTokenizer.from_pretrained(self.config.model)
        
    def __load_model(self, model: str, bnbc: Optional[BitsAndBytesConfig] = None):
        print(f"## Aici.__load_model({model})")
        
        if bnbc is None:
            print(f"## Aici.__load_model({model}) - No BnB")
            self.model = AutoModelForCausalLM.from_pretrained(
                self.config.model,
                device_map="auto",
                attn_implementation='eager',
                torch_dtype=torch.float16
            )
        else:
            print(f"## Aici.__load_model({model}) - BnB")
            self.model = AutoModelForCausalLM.from_pretrained(
                self.config.model,
                device_map="auto",
                attn_implementation='eager',
                quantization_config=bnbc
            )

    def __hf_login(self):
        print("## Aici.__hf_login()")

        login(self.config.hf_token)
        
    def load(self, model: Optional[str] = None, bnbc: Optional[BitsAndBytesConfig] = None):
        print("## Aici.load()")
        
        self.__cleanup()
       
        self.__load_config()
        self.__hf_login()
        
        self.__load_tokenizer()
        
        if model is not None:
            self.__load_model(model, bnbc)
        else:
            self.__load_model(self.config.model, bnbc)
    
    def chat(self, messages):
        print("## Aici.chat()")
        
        inputs = self.tokenizer.apply_chat_template(
            messages, 
            return_tensors="pt", 
            return_dict=True,
            add_generation_prompt=True,
            max_length=self.config.max_length
        ).to(self.device)
        
        start_time = time()
        outputs = self.model.generate(**inputs, max_new_tokens=self.config.max_new_tokens)
        end_time = time()
    
        input_tokens = inputs["input_ids"].size(-1)
        output_tokens = outputs[0].size(-1)
        
        decoded = self.tokenizer.decode(outputs[0])
        regex = re.compile("<start_of_turn>([\\w\\W]*?)\\n([\\w\\W]*?)<end_of_turn>")
        matches = re.findall(regex, decoded)
        lastMatch = matches[-1]
        contents = lastMatch[1].strip()
        
        return {
            "inputTokens": input_tokens,
            "outputTokens": output_tokens,
            "seconds": end_time - start_time,
            "message": {
                "role": "assistant", 
                "content": contents
            }
        }
    
    def __load_dataset(self, file):
        print(f"## Aici.__load_dataset({file})")

        contents = FileHelper().read(Config.datasets_dir + "/" + file + ".ds.json")
        jsonContents = json.loads(contents)

        self.max_length = 0
        for lesson in jsonContents["lessons"]:
            notPadded = self.tokenizer.apply_chat_template(
                lesson["messages"],
                return_tensors="pt",
                return_dict=True
            )
            
            length = len(notPadded["input_ids"].squeeze(0).tolist())
            print(f"## Aici.__load_dataset({file}) - Len: {length}")
            if length > self.max_length:
                self.max_length = length
        
        print(f"## Aici.__load_dataset({file}) - Max Tokens: {self.max_length}")

        messages = []

        for lesson in jsonContents["lessons"]:
            tokenized = self.tokenizer.apply_chat_template(
                lesson["messages"],
                return_tensors="pt",
                return_dict=True,
                padding="max_length",
                truncation=True,
                max_length=self.max_length
            )

            messages.append({
                "input_ids": tokenized["input_ids"].squeeze(0).tolist(),
                "attention_mask": tokenized["attention_mask"].squeeze(0).tolist()
            })


        dataset = Dataset.from_dict({
            "input_ids": [msg["input_ids"] for msg in messages],
            "attention_mask": [msg["attention_mask"] for msg in messages]
        })

        dataset_dict = DatasetDict({"train": dataset})

        return dataset_dict
    
    def train(self):
        print("## Aici.train()")
        
        print("## Aici.train() - BnB")
        bnb_config = BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_quant_type="nf4",
            bnb_4bit_compute_dtype=torch.float16,
            bnb_4bit_use_double_quant=True,
        )
        
        print("## Aici.train() - Loading")
        self.load(self.config.source_model, bnb_config)

        print("## Aici.train() - Adjusting Loaded")
        self.tokenizer.padding_side = "right"
        self.model.config.use_cache = False
        self.model.config.pretraining_tp = 1            

        print("## Aici.train() - Determine Modules")
        cls = bitsandbytes.nn.Linear4bit
        lora_modules_names = set()
        for name, module in self.model.named_modules():
            if isinstance(module, cls):
                names = name.split(".")
                lora_modules_names.add(names[0] if len(names) == 1 else names[-1])
        if "lm_head" in lora_modules_names:
            lora_modules_names.remove("lm_head")
        target_modules = list(lora_modules_names)
        
        print(f"## Target Modules: {target_modules}")
        
        print("## Aici.train() - Lora Config")
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

        print("## Aici.train() - Training Arguments")
        run_name = datetime.now().strftime("%Y%m%d%H%M%S")
        training_arguments = TrainingArguments(
            output_dir=self.config.train_output_dir,
            num_train_epochs=self.config.epochs,
            logging_strategy="epoch",

            per_device_train_batch_size=1,
            fp16=True,
            run_name=run_name,
            # gradient_accumulation_steps=4,
            # gradient_checkpointing=True,
        )
        
        print("## Aici.train() - For Each File")
        files = FileHelper().list(Config.datasets_dir, ".ds.json")
        for file in files:
            print(f"## Aici.train() - File {file}")
            dataset = self.__load_dataset(file)
                    
            print(f"## Aici.train() - SFTTrainer")
            trainer = SFTTrainer(
                model=self.model,
                train_dataset=dataset["train"],
                tokenizer=self.tokenizer,
                args=training_arguments,
                max_seq_length=self.max_length,
                dataset_text_field="input_ids"
            )
        
            print(f"## Aici.train() - Add Callback")
            trainer.add_callback(EarlyStoppingCallback())

            print(f"## Aici.train() - File {file} - Starting Training")
            trainer.train()
            print(f"## Aici.train() - File {file} - Finished Training")        
                
        print("## Starting Merge") 
        print(f"## Type {type(self.model)}") 
        self.model = self.model.merge_and_unload()
        print(f"## Type {type(self.model)}") 
        print("## Finished Merge")

        epoch_output = f"{self.config.target_model}"
        print(f"## Saving: {epoch_output}")
        self.tokenizer.save_pretrained(epoch_output)
        self.model.save_pretrained(epoch_output)
        print(f"## Saved: {epoch_output}")                  
    
    def push_to_hub(self):
        print("## Aici.push_to_hub()")

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
        if len(state.log_history) > 0:
            last_log = state.log_history[-1]
            if last_log.get("loss", None) is not None:
                current_loss = last_log["loss"]
                
                if current_loss <= self.config.target_loss:
                    print(f"\n## Early stopping triggered. Loss: {current_loss} <= {self.config.target_loss}\n")
                    control.should_training_stop = True