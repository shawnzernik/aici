import { Message } from "./Message";

/**
 * Represents a request to the chat API.
 */
export interface ChatRequest {
    /** 
     * The model to be used for the chat interaction.
     */
    model: string;
    /** 
     * An array of messages that comprise the chat history or context.
     */
    messages: Message[];
    /** 
     * The temperature parameter for the model, affecting randomness.
     * Optional property.
     */
    temperature?: number;
    /** 
     * The maximum number of tokens to generate in the response.
     * Optional property.
     */
    max_tokens?: number;
}
