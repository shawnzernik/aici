export interface FinetuneDto {
    guid: string;
    displayName: string;
    suffix: string;
    id: string;
    model: string;
    epochs?: number;
    learningRateMultiplier?: number;
    batchSize?: number;
    seed?: number;
    trainingFile: string;
    trainingData: string;
    validationFile?: string;
    validationData?: string;
}