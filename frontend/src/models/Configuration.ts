import { Message } from "./Message";

export interface Configuration {
    startingConversation: Message[];
    model: string;
    hfToken: string;
    maxNewTokens: number;
    messageRegex: string;
    sourceModel: string;
    targetModel: string;
    taskType: string;
    epochs: number;
    trainMaxLength: number;
    trainOutputDir: string;
    targetLoss: number;
    pushToModel: string;
}