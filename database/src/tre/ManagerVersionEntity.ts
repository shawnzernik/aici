import { Entity, PrimaryColumn, Column } from "typeorm";
import { CopyInterface } from "./CopyInterface";
import { ManagerVersionDto } from "./ManagerVersionDto";

@Entity("manager_versions")
export class ManagerVersionEntity implements ManagerVersionDto, CopyInterface<ManagerVersionDto> {
    @PrimaryColumn({ name: "guid" })
    public guid: string = "";

    @Column({ name: "version" })
    public version: string = "";

    @Column({ name: "occurred" })
    public occurred: Date = new Date();

    @Column({ name: "success" })
    public success: boolean = false;

    @Column({ name: "log" })
    public log: string = "";

    public copyFrom(source: ManagerVersionDto): void {
        this.guid = source.guid;
        this.log = source.log;
        this.occurred = source.occurred;
        this.success = source.success;
        this.version = source.version
    }

    public copyTo(dest: ManagerVersionDto): void {
        dest.guid = this.guid;
        dest.log = this.log;
        dest.occurred = this.occurred;
        dest.success = this.success;
        dest.version = this.version
    }
}