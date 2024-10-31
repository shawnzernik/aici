import { Entity, PrimaryColumn, Column } from 'typeorm';
import { CopyInterface } from "common/src/logic/CopyInterface";
import { UserDto } from "common/src/models/UserDto";

/**
 * Represents the User entity in the database.
 * Maps to the 'users' table and implements UserDto and CopyInterface<UserDto>.
 */
@Entity('users')
export class UserEntity implements UserDto, CopyInterface<UserDto> {
    /** 
     * Unique identifier for the user. 
     * Maps to the 'guid' column in the database.
     */
    @PrimaryColumn({ name: "guid" })
    public guid: string = "";

    /** 
     * Display name of the user. 
     * Maps to the 'display_name' column in the database.
     */
    @Column({ name: 'display_name' })
    public displayName: string = "";

    /** 
     * Email address of the user. 
     * Maps to the 'email_address' column in the database.
     */
    @Column({ name: 'email_address' })
    public emailAddress: string = "";

    /** 
     * SMS phone number of the user. 
     * Maps to the 'sms_phone' column in the database.
     */
    @Column({ name: 'sms_phone' })
    public smsPhone: string = "";

    /** 
     * Copies properties from the given UserDto source to the current instance. 
     * @param source - The UserDto object to copy properties from.
     */
    public copyFrom(source: UserDto): void {
        this.guid = source.guid;
        this.displayName = source.displayName;
        this.emailAddress = source.emailAddress;
        this.smsPhone = source.smsPhone;
    }

    /** 
     * Copies properties from the current instance to the given UserDto destination. 
     * @param dest - The UserDto object to copy properties to.
     */
    public copyTo(dest: UserDto): void {
        dest.guid = this.guid;
        dest.displayName = this.displayName;
        dest.emailAddress = this.emailAddress;
        dest.smsPhone = this.smsPhone;
    }
}
