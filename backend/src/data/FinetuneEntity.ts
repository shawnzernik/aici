import { Entity, PrimaryColumn, Column } from 'typeorm';
import { CopyInterface } from "common/src/logic/CopyInterface";
import { FinetuneDto } from "common/src/models/FinetuneDto";

/**
 * Represents a finetune entity in the database.
 */
@Entity('finetunes')
export class FinetuneEntity implements FinetuneDto, CopyInterface<FinetuneDto> {
    /** 
     * The unique identifier for the finetune.
     * @type {string}
     */
    @PrimaryColumn({ name: "guid" })
    public guid: string = "";

    /** 
     * The display name of the finetune.
     * @type {string}
     */
    @Column({ name: 'display_name' })
    public displayName: string = "";

    /** 
     * The suffix associated with the finetune.
     * @type {string}
     */
    @Column({ name: 'suffix' })
    public suffix: string = "";

    /** 
     * The ID of the finetune.
     * @type {string}
     */
    @Column({ name: 'id' })
    public id: string = "";

    /** 
     * The model associated with the finetune.
     * @type {string}
     */
    @Column({ name: 'model' })
    public model: string = "";

    /** 
     * The number of epochs for training.
     * @type {number}
     * @optional
     */
    @Column({ name: 'epochs', nullable: true })
    public epochs?: number;

    /** 
     * The learning rate multiplier.
     * @type {number}
     * @optional
     */
    @Column({ name: 'learning_rate_multiplier', nullable: true })
    public learningRateMultiplier?: number;

    /** 
     * The batch size for training.
     * @type {number}
     * @optional
     */
    @Column({ name: 'batch_size', nullable: true })
    public batchSize?: number;

    /** 
     * The seed for random number generation.
     * @type {number}
     * @optional
     */
    @Column({ name: 'seed', nullable: true })
    public seed?: number;

    /** 
     * The training file path.
     * @type {string}
     */
    @Column({ name: 'training_file' })
    public trainingFile: string = "";

    /** 
     * The training data path.
     * @type {string}
     */
    @Column({ name: 'training_data' })
    public trainingData: string = "";

    /** 
     * The validation file path.
     * @type {string}
     * @optional
     */
    @Column({ name: 'validation_file', nullable: true })
    public validationFile?: string;

    /** 
     * The validation data path.
     * @type {string}
     * @optional
     */
    @Column({ name: 'validation_data', nullable: true })
    public validationData?: string;

    /** 
     * Copies properties from the source FinetuneDto to this entity.
     * @param {FinetuneDto} source - The source object to copy from.
     */
    public copyFrom(source: FinetuneDto): void {
        this.guid = source.guid;
        this.displayName = source.displayName;
        this.suffix = source.suffix;
        this.id = source.id;
        this.model = source.model;
        this.epochs = source.epochs;
        this.learningRateMultiplier = source.learningRateMultiplier;
        this.batchSize = source.batchSize;
        this.seed = source.seed;
        this.trainingFile = source.trainingFile;
        this.trainingData = source.trainingData;
        this.validationFile = source.validationFile;
        this.validationData = source.validationData;
    }

    /** 
     * Copies properties from this entity to the destination FinetuneDto.
     * @param {FinetuneDto} dest - The destination object to copy to.
     */
    public copyTo(dest: FinetuneDto): void {
        dest.guid = this.guid;
        dest.displayName = this.displayName;
        dest.suffix = this.suffix;
        dest.id = this.id;
        dest.model = this.model;
        dest.epochs = this.epochs;
        dest.learningRateMultiplier = this.learningRateMultiplier;
        dest.batchSize = this.batchSize;
        dest.seed = this.seed;
        dest.trainingFile = this.trainingFile;
        dest.trainingData = this.trainingData;
        dest.validationFile = this.validationFile;
        dest.validationData = this.validationData;
    }
}