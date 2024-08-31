import { Message } from "./Message";

export interface Response {
    inputTokens: number;
    outputTokens: number;
    seconds: number;
    message: Message;
}