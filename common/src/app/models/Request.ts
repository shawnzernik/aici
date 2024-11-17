import { Message } from "./Message";

export interface ChatRequest {
    model: string;
    messages: Message[];
    temperature?: number;
    max_tokens?: number;
}
