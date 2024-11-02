import { Message } from "./Message";

/**
 * Interface representing an API response.
 */
export interface Response {
    /** Unique identifier for the response */
    id: string;
    /** Type of object returned */
    object: string;
    /** Timestamp indicating when the response was created */
    created: number;
    /** Array of choices provided in the response */
    choices: Array<{
        /** Index of the choice in the array */
        index: number;
        /** Message associated with the choice */
        message: Message;
        /** Reason for finishing the response */
        finish_reason: string;
    }>;
    /** Usage statistics for the response */
    usage: {
        /** Number of tokens used in the completion */
        completion_tokens: number;
        /** Number of tokens used in the prompt */
        prompt_tokens: number;
        /** Total number of tokens used */
        total_tokens: number;
    };
}
