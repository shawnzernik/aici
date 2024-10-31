// Interface representing an embedding data transfer object.
export interface EmbeddingDto {
    /** The type of object, in this case, it should be 'embedding'. */
    object: string;
    /** An array of numbers representing the embedding vector. */
    embedding: number[];
    /** The index of the embedding in a collection of embeddings. */
    index: number;
}
