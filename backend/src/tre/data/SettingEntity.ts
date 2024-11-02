import { Entity, PrimaryColumn, Column } from 'typeorm';
import { CopyInterface } from "common/src/tre/logic/CopyInterface";
import { SettingDto } from "common/src/tre/models/SettingDto";

/**
 * Represents the settings entity in the database.
 */
@Entity('settings')
export class SettingEntity implements SettingDto, CopyInterface<SettingDto> {
    /**
     * Unique identifier for the setting.
     */
    @PrimaryColumn({ name: "guid" })
    public guid: string = "";

    /**
     * The key associated with the setting.
     */
    @Column({ name: 'key' })
    public key: string = "";

    /**
     * The value associated with the setting.
     */
    @Column({ name: 'value' })
    public value: string = "";

    /**
     * Copies properties from the provided source object to the current object.
     * @param source - The source object to copy properties from.
     */
    public copyFrom(source: SettingDto): void {
        this.guid = source.guid;
        this.key = source.key;
        this.value = source.value;
    }

    /**
     * Copies properties from the current object to the provided destination object.
     * @param dest - The destination object to copy properties to.
     */
    public copyTo(dest: SettingDto): void {
        dest.guid = this.guid;
        dest.key = this.key;
        dest.value = this.value;
    }
}
