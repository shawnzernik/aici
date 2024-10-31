/**
 * Interface representing a finetune model data transfer object.
 */
export interface FinetuneDto {
    /** Unique identifier for the finetune configuration */
    guid: string;
    /** Display name for the finetune configuration */
    displayName: string;
    /** File suffix associated with the model */
    suffix: string;
    /** Unique identifier for the model in the system */
    id: string;
    /** Name of the model being finetuned */
    model: string;
    /** Number of training epochs (optional) */
    epochs?: number;
    /** Learning rate multiplier (optional) */
    learningRateMultiplier?: number;
    /** Size of the batch for training (optional) */
    batchSize?: number;
    /** Random seed for reproducibility (optional) */
    seed?: number;
    /** Path to the training file */
    trainingFile: string;
    /** Path to the training data */
    trainingData: string;
    /** Path to the validation file (optional) */
    validationFile?: string;
    /** Path to the validation data (optional) */
    validationData?: string;
}
