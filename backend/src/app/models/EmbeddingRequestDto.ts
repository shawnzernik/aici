export interface EmbeddingRequestDto {
    model: string;
    input: string | string[] | number[] | number[][];
}