import { Message } from "./Message";

export interface Response {
    id: string;
    object: string;
    created: number;
    choices: Array<{
        index: number;
        message: Message;
        finish_reason: string;
    }>;
    usage: {
        completion_tokens: number;
        prompt_tokens: number;
        total_tokens: number;
    };
}