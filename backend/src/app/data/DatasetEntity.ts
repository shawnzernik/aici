import { Entity, PrimaryColumn, Column } from "typeorm";
import { CopyInterface } from "common/src/tre/logic/CopyInterface";
import { DatasetDto } from "common/src/app/models/DatasetDto";

@Entity("datasets")
export class DatasetEntity implements DatasetDto, CopyInterface<DatasetDto> {
    @PrimaryColumn({ name: "guid" })
    public guid: string = "";

    @Column({ name: "is_uploaded", default: true })
    public isUploaded: boolean = true;

    @Column({ name: "include_in_training", default: false })
    public includeInTraining: boolean = false;

    @Column({ name: "title" })
    public title: string = "";

    @Column({ name: "json" })
    public json: string = "";

    public copyFrom(source: DatasetDto): void {
        this.guid = source.guid;
        this.isUploaded = source.isUploaded;
        this.includeInTraining = source.includeInTraining;
        this.title = source.title;
        this.json = source.json;
    }

    public copyTo(dest: DatasetDto): void {
        dest.guid = this.guid;
        dest.isUploaded = this.isUploaded;
        dest.includeInTraining = this.includeInTraining;
        dest.title = this.title;
        dest.json = this.json;
    }
}