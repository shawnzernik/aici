import { Entity, PrimaryColumn, Column } from "typeorm";
import { CopyInterface } from "common/src/tre/logic/CopyInterface";
import { MembershipDto } from "common/src/tre/models/MembershipDto";

@Entity("memberships")
export class MembershipEntity implements MembershipDto, CopyInterface<MembershipDto> {
    @PrimaryColumn({ name: "guid" })
    public guid: string = "";

    @Column({ name: "groups_guid" })
    public groupsGuid: string = "";

    @Column({ name: "users_guid" })
    public usersGuid: string = "";

    @Column({ name: "is_included" })
    public isIncluded: boolean = false;

    public copyFrom(source: MembershipDto): void {
        this.guid = source.guid;
        this.groupsGuid = source.groupsGuid;
        this.usersGuid = source.usersGuid;
        this.isIncluded = source.isIncluded;
    }

    public copyTo(dest: MembershipDto): void {
        dest.guid = this.guid;
        dest.groupsGuid = this.groupsGuid;
        dest.usersGuid = this.usersGuid;
        dest.isIncluded = this.isIncluded;
    }
}
