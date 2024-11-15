import { Entity, PrimaryColumn, Column } from "typeorm";
import { CopyInterface } from "common/src/tre/logic/CopyInterface";
import { PermissionDto } from "common/src/tre/models/PermissionDto";

@Entity("permissions")
export class PermissionEntity implements PermissionDto, CopyInterface<PermissionDto> {
    @PrimaryColumn({ name: "guid" })
    public guid: string = "";

    @Column({ name: "groups_guid" })
    public groupsGuid: string = "";

    @Column({ name: "securables_guid" })
    public securablesGuid: string = "";

    @Column({ name: "is_allowed" })
    public isAllowed: boolean = false;

    public copyFrom(source: PermissionDto): void {
        this.guid = source.guid;
        this.groupsGuid = source.groupsGuid;
        this.securablesGuid = source.securablesGuid;
        this.isAllowed = source.isAllowed;
    }

    public copyTo(dest: PermissionDto): void {
        dest.guid = this.guid;
        dest.groupsGuid = this.groupsGuid;
        dest.securablesGuid = this.securablesGuid;
        dest.isAllowed = this.isAllowed;
    }
}