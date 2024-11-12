import { Entity, PrimaryColumn, Column } from "typeorm";
import { CopyInterface } from "common/src/tre/logic/CopyInterface";
import { GroupDto } from "common/src/tre/models/GroupDto";

@Entity("groups")
export class GroupEntity implements GroupDto, CopyInterface<GroupDto> {
    @PrimaryColumn({ name: "guid" })
    public guid: string = "";

    @Column({ name: "display_name" })
    public displayName: string = "";

    @Column({ name: "is_administrator" })
    public isAdministrator: boolean = false;

    public copyFrom(source: GroupDto): void {
        this.guid = source.guid;
        this.displayName = source.displayName;
        this.isAdministrator = source.isAdministrator;
    }

    public copyTo(dest: GroupDto): void {
        dest.guid = this.guid;
        dest.displayName = this.displayName;
        dest.isAdministrator = this.isAdministrator;
    }
}