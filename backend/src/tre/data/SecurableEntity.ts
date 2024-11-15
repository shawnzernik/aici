import { Entity, PrimaryColumn, Column } from "typeorm";
import { CopyInterface } from "common/src/tre/logic/CopyInterface";
import { SecurableDto } from "common/src/tre/models/SecurableDto";

@Entity("securables")
export class SecurableEntity implements SecurableDto, CopyInterface<SecurableDto> {
    @PrimaryColumn({ name: "guid" })
    public guid: string = "";

    @Column({ name: "display_name" })
    public displayName: string = "";

    public copyFrom(source: SecurableDto): void {
        this.guid = source.guid;
        this.displayName = source.displayName;
    }

    public copyTo(dest: SecurableDto): void {
        dest.guid = this.guid;
        dest.displayName = this.displayName;
    }
}