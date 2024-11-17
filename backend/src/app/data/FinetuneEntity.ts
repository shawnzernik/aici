import { Entity, PrimaryColumn, Column } from "typeorm";
import { CopyInterface } from "common/src/tre/logic/CopyInterface";
import { FinetuneDto } from "common/src/app/models/FinetuneDto";

@Entity("finetunes")
export class FinetuneEntity implements FinetuneDto, CopyInterface<FinetuneDto> {
    @PrimaryColumn({ name: "guid" })
    public guid: string = "";

    @Column({ name: "display_name" })
    public displayName: string = "";

    @Column({ name: "suffix" })
    public suffix: string = "";

    @Column({ name: "id" })
    public id: string = "";

    @Column({ name: "model" })
    public model: string = "";

    @Column({ name: "epochs", nullable: true })
    public epochs?: number;

    @Column({ name: "learning_rate_multiplier", nullable: true })
    public learningRateMultiplier?: number;

    @Column({ name: "batch_size", nullable: true })
    public batchSize?: number;

    @Column({ name: "seed", nullable: true })
    public seed?: number;

    @Column({ name: "training_file" })
    public trainingFile: string = "";

    @Column({ name: "training_data" })
    public trainingData: string = "";

    @Column({ name: "validation_file", nullable: true })
    public validationFile?: string;

    @Column({ name: "validation_data", nullable: true })
    public validationData?: string;

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