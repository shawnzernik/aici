import { Message } from "./Message";

export interface Configuration {
    startingConversation: Message[];
    model: string;
    hfToken: string;
    maxNewTokens: number;
    maxLength: number;
    targetModel: string;
    taskType: string;
    epochs: number;
    trainOutputDir: string;
    targetLoss: number;
    pushToModel: string;
}