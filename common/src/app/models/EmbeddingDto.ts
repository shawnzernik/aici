/**
 * Interface representing an embedding data transfer object.
 */
export interface EmbeddingDto {
    /** Unique identifier for the embedding */
    guid: string;
    /** Title of the embedding */
    title: string;
    /** Input text for the embedding */
    input: string;
    /** JSON representation of the embedding */
    embeddingJson: string;
    /** Number of tokens used in the prompt */
    promptTokens: number;
    /** Total number of tokens used */
    totalTokens: number;
}
