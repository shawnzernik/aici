import { Entity, PrimaryColumn, Column } from 'typeorm';
import { CopyInterface } from "common/src/logic/CopyInterface";
import { MembershipDto } from "common/src/models/MembershipDto";

/**
 * Represents the Membership entity in the database.
 * Maps to the 'memberships' table and implements MembershipDto and CopyInterface.
 */
@Entity('memberships')
export class MembershipEntity implements MembershipDto, CopyInterface<MembershipDto> {
    /** 
     * Unique identifier for the membership.
     * @type {string}
     */
    @PrimaryColumn({ name: "guid" })
    public guid: string = "";

    /** 
     * Identifier for the group associated with the membership.
     * @type {string}
     */
    @Column({ name: 'groups_guid' })
    public groupsGuid: string = "";

    /** 
     * Identifier for the user associated with the membership.
     * @type {string}
     */
    @Column({ name: 'users_guid' })
    public usersGuid: string = "";

    /** 
     * Indicates if the membership is included.
     * @type {boolean}
     */
    @Column({ name: 'is_included' })
    public isIncluded: boolean = false;

    /**
     * Copies properties from a source MembershipDto to this instance.
     * @param {MembershipDto} source - The source object to copy from.
     */
    public copyFrom(source: MembershipDto): void {
        this.guid = source.guid;
        this.groupsGuid = source.groupsGuid;
        this.usersGuid = source.usersGuid;
        this.isIncluded = source.isIncluded;
    }

    /**
     * Copies properties from this instance to a destination MembershipDto.
     * @param {MembershipDto} dest - The destination object to copy to.
     */
    public copyTo(dest: MembershipDto): void {
        dest.guid = this.guid;
        dest.groupsGuid = this.groupsGuid;
        dest.usersGuid = this.usersGuid;
        dest.isIncluded = this.isIncluded;
    }
}
