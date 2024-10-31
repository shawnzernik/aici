import { Entity, PrimaryColumn, Column } from 'typeorm';
import { CopyInterface } from "common/src/logic/CopyInterface";
import { PermissionDto } from "common/src/models/PermissionDto";

/**
 * Represents a permission entity in the database.
 */
@Entity('permissions')
export class PermissionEntity implements PermissionDto, CopyInterface<PermissionDto> {
    /**
     * Unique identifier for the permission.
     */
    @PrimaryColumn({ name: "guid" })
    public guid: string = "";

    /**
     * GUID of the group associated with the permission.
     */
    @Column({ name: 'groups_guid' })
    public groupsGuid: string = "";

    /**
     * GUID of the securable associated with the permission.
     */
    @Column({ name: 'securables_guid' })
    public securablesGuid: string = "";

    /**
     * Indicates whether the permission is allowed.
     */
    @Column({ name: 'is_allowed' })
    public isAllowed: boolean = false;

    /**
     * Copies properties from the source PermissionDto to this entity.
     * @param source - The source PermissionDto to copy from.
     */
    public copyFrom(source: PermissionDto): void {
        this.guid = source.guid;
        this.groupsGuid = source.groupsGuid;
        this.securablesGuid = source.securablesGuid;
        this.isAllowed = source.isAllowed;
    }

    /**
     * Copies properties from this entity to the destination PermissionDto.
     * @param dest - The destination PermissionDto to copy to.
     */
    public copyTo(dest: PermissionDto): void {
        dest.guid = this.guid;
        dest.groupsGuid = this.groupsGuid;
        dest.securablesGuid = this.securablesGuid;
        dest.isAllowed = this.isAllowed;
    }
}
