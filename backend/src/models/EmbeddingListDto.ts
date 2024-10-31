import { EmbeddingDto } from "./EmbeddingDto";

/**
 * Represents a list of embeddings.
 */
export interface EmbeddingListDto {
    /** The type of object returned. */
    object: string;
    /** An array of embeddings. */
    data: EmbeddingDto[];
    /** The model used to generate the embeddings. */
    model: string;
    /** Usage statistics for the request. */
    usage: {
        /** Number of tokens used in the prompt. */
        prompt_tokens: number;
        /** Total number of tokens used. */
        total_tokens: number;
    }
}
