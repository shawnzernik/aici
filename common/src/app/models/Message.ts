/**
 * Represents the role of a message in the communication.
 */
export type MessageRole = "system" | "user" | "assistant";

/**
 * Represents a message in the communication.
 */
export interface Message {
    /** Role of the message sender */
    role: MessageRole;
    /** Content of the message */
    content: string;
}
