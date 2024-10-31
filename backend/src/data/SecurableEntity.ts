import { Entity, PrimaryColumn, Column } from 'typeorm';
import { CopyInterface } from "common/src/logic/CopyInterface";
import { SecurableDto } from "common/src/models/SecurableDto";

/**
 * Represents a securable entity in the database.
 * Implements the SecurableDto interface and the CopyInterface for SecurableDto.
 */
@Entity('securables')
export class SecurableEntity implements SecurableDto, CopyInterface<SecurableDto> {
    /**
     * The unique identifier for the securable entity.
     */
    @PrimaryColumn({ name: "guid" })
    public guid: string = "";

    /**
     * The display name of the securable entity.
     */
    @Column({ name: 'display_name' })
    public displayName: string = "";

    /**
     * Copies properties from the given SecurableDto source to this entity.
     * @param source - The SecurableDto object to copy properties from.
     */
    public copyFrom(source: SecurableDto): void {
        this.guid = source.guid;
        this.displayName = source.displayName;
    }

    /**
     * Copies properties from this entity to the given SecurableDto destination.
     * @param dest - The SecurableDto object to copy properties to.
     */
    public copyTo(dest: SecurableDto): void {
        dest.guid = this.guid;
        dest.displayName = this.displayName;
    }
}
