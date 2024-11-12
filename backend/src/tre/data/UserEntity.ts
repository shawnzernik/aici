import { Entity, PrimaryColumn, Column } from "typeorm";
import { CopyInterface } from "common/src/tre/logic/CopyInterface";
import { UserDto } from "common/src/tre/models/UserDto";

@Entity("users")
export class UserEntity implements UserDto, CopyInterface<UserDto> {
    @PrimaryColumn({ name: "guid" })
    public guid: string = "";

    @Column({ name: "display_name" })
    public displayName: string = "";

    @Column({ name: "email_address" })
    public emailAddress: string = "";

    @Column({ name: "sms_phone" })
    public smsPhone: string = "";

    public copyFrom(source: UserDto): void {
        this.guid = source.guid;
        this.displayName = source.displayName;
        this.emailAddress = source.emailAddress;
        this.smsPhone = source.smsPhone;
    }

    public copyTo(dest: UserDto): void {
        dest.guid = this.guid;
        dest.displayName = this.displayName;
        dest.emailAddress = this.emailAddress;
        dest.smsPhone = this.smsPhone;
    }
}
