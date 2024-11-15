import { Entity, PrimaryColumn, Column } from "typeorm";
import { CopyInterface } from "common/src/tre/logic/CopyInterface";
import { SettingDto } from "common/src/tre/models/SettingDto";

@Entity("settings")
export class SettingEntity implements SettingDto, CopyInterface<SettingDto> {
    @PrimaryColumn({ name: "guid" })
    public guid: string = "";

    @Column({ name: "key" })
    public key: string = "";

    @Column({ name: "value" })
    public value: string = "";

    public copyFrom(source: SettingDto): void {
        this.guid = source.guid;
        this.key = source.key;
        this.value = source.value;
    }

    public copyTo(dest: SettingDto): void {
        dest.guid = this.guid;
        dest.key = this.key;
        dest.value = this.value;
    }
}