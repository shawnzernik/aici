import { Entity, PrimaryColumn, Column } from 'typeorm';
import { CopyInterface } from "common/src/logic/CopyInterface";
import { PasswordDto } from "common/src/models/PasswordDto";

/**
 * Represents the password entity stored in the database.
 */
@Entity('passwords')
export class PasswordEntity implements PasswordDto, CopyInterface<PasswordDto> {
    /**
     * The unique identifier for the password record.
     */
    @PrimaryColumn({ name: "guid" })
    public guid: string = "";

    /**
     * The unique identifier of the user associated with this password.
     */
    @Column({ name: 'users_guid' })
    public usersGuid: string = "";

    /**
     * The date and time when the password was created.
     */
    @Column({ name: 'created' })
    public created: Date = new Date();

    /**
     * The salt used for hashing the password.
     */
    @Column({ name: 'salt' })
    public salt: string = "";

    /**
     * The hashed password.
     */
    @Column({ name: 'hash' })
    public hash: string = "";

    /**
     * The number of iterations used in the hashing algorithm.
     */
    @Column({ name: 'iterations' })
    public iterations: number = 0;

    /**
     * Copies properties from the provided PasswordDto source to this entity.
     * @param source - The source PasswordDto object to copy from.
     */
    public copyFrom(source: PasswordDto): void {
        this.guid = source.guid;
        this.usersGuid = source.usersGuid;
        this.created = source.created;
        this.salt = source.salt;
        this.hash = source.hash;
        this.iterations = source.iterations;
    }

    /**
     * Copies properties from this entity to the provided PasswordDto destination.
     * @param dest - The destination PasswordDto object to copy to.
     */
    public copyTo(dest: PasswordDto): void {
        dest.guid = this.guid;
        dest.usersGuid = this.usersGuid;
        dest.created = this.created;
        dest.salt = this.salt;
        dest.hash = this.hash;
        dest.iterations = this.iterations;
    }
}
