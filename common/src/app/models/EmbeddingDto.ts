export interface EmbeddingDto {
    guid: string;
    title: string;
    input: string;
    embeddingJson: string;
    promptTokens: number;
    totalTokens: number;
}