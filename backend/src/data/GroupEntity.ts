import { Entity, PrimaryColumn, Column } from 'typeorm';
import { CopyInterface } from "common/src/logic/CopyInterface";
import { GroupDto } from "common/src/models/GroupDto";

/**
 * Represents the Group entity in the database.
 * Implements the GroupDto interface and the CopyInterface for copying data.
 */
@Entity('groups')
export class GroupEntity implements GroupDto, CopyInterface<GroupDto> {
    /**
     * Unique identifier for the group.
     */
    @PrimaryColumn({ name: "guid" })
    public guid: string = "";

    /**
     * Display name of the group.
     */
    @Column({ name: 'display_name' })
    public displayName: string = "";

    /**
     * Indicates if the group has administrator privileges.
     */
    @Column({ name: 'is_administrator' })
    public isAdministrator: boolean = false;

    /**
     * Copies properties from the source GroupDto to the current instance.
     * @param source - The source GroupDto to copy from.
     */
    public copyFrom(source: GroupDto): void {
        this.guid = source.guid;
        this.displayName = source.displayName;
        this.isAdministrator = source.isAdministrator;
    }

    /**
     * Copies properties from the current instance to the destination GroupDto.
     * @param dest - The destination GroupDto to copy to.
     */
    public copyTo(dest: GroupDto): void {
        dest.guid = this.guid;
        dest.displayName = this.displayName;
        dest.isAdministrator = this.isAdministrator;
    }
}