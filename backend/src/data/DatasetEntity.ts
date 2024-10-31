import { Entity, PrimaryColumn, Column } from 'typeorm';
import { CopyInterface } from "common/src/logic/CopyInterface";
import { DatasetDto } from "common/src/models/DatasetDto";

/**
 * Represents the dataset entity in the database.
 * Maps to the 'datasets' table and implements DatasetDto and CopyInterface.
 */
@Entity('datasets')
export class DatasetEntity implements DatasetDto, CopyInterface<DatasetDto> {
    /**
     * Unique identifier for the dataset.
     * @type {string}
     */
    @PrimaryColumn({ name: "guid" })
    public guid: string = "";

    /**
     * Indicates whether the dataset has been uploaded.
     * @type {boolean}
     * @default true
     */
    @Column({ name: 'is_uploaded', default: true })
    public isUploaded: boolean = true;

    /**
     * Indicates whether the dataset should be included in training.
     * @type {boolean}
     * @default false
     */
    @Column({ name: 'include_in_training', default: false })
    public includeInTraining: boolean = false;

    /**
     * Title of the dataset.
     * @type {string}
     */
    @Column({ name: 'title' })
    public title: string = "";

    /**
     * JSON representation of the dataset.
     * @type {string}
     */
    @Column({ name: 'json' })
    public json: string = "";

    /**
     * Copies data from a source DatasetDto to the current instance.
     * @param {DatasetDto} source - The source object to copy data from.
     */
    public copyFrom(source: DatasetDto): void {
        this.guid = source.guid;
        this.isUploaded = source.isUploaded;
        this.includeInTraining = source.includeInTraining;
        this.title = source.title;
        this.json = source.json;
    }

    /**
     * Copies data from the current instance to a destination DatasetDto.
     * @param {DatasetDto} dest - The destination object to copy data to.
     */
    public copyTo(dest: DatasetDto): void {
        dest.guid = this.guid;
        dest.isUploaded = this.isUploaded;
        dest.includeInTraining = this.includeInTraining;
        dest.title = this.title;
        dest.json = this.json;
    }
}
