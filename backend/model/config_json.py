from typing import List


class ConfigJson:
    hf_token: str
    model: str
    max_new_tokens: int
    max_length: int
    starting_conversation: List[dict[str, str]]
    target_model: str
    task_type: str
    epochs: int
    train_output_dir: str
    target_loss: float
    push_to_model: str

    def __init__(self, dict):
        self.hf_token = dict['hfToken']
        self.model = dict['model']
        self.max_new_tokens = dict['maxNewTokens']
        self.max_length = dict['maxLength']
        self.starting_conversation = dict["startingConversation"]
        self.target_model = dict['targetModel']
        self.task_type = dict["taskType"]
        self.epochs = dict["epochs"]
        self.train_output_dir = dict["trainOutputDir"]
        self.target_loss = dict["targetLoss"]
        self.push_to_model = dict["pushToModel"]
