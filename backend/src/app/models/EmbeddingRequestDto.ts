/**
 * Interface representing an embedding request.
 */
export interface EmbeddingRequestDto {
    /** The model to be used for the embedding. */
    model: string;
    /** The input for the embedding, can be of various types. */
    input: string | string[] | number[] | number[][];
}
