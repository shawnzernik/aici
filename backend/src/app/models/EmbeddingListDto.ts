import { EmbeddingDto } from "./EmbeddingDto";

export interface EmbeddingListDto {
    object: string;
    data: EmbeddingDto[];
    model: string;
    usage: {
        prompt_tokens: number;
        total_tokens: number;
    }
}
