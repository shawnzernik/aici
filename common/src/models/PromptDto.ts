/**
 * Interface representing a prompt data transfer object.
 */
export interface PromptDto {
    /** Unique identifier for the prompt. */
    guid: string;
    /** Title of the prompt. */
    title: string;
    /** Input associated with the prompt. */
    input: string;
    /** JSON representation of the prompt. */
    json: string;
}
