import { Entity, PrimaryColumn, Column } from "typeorm";
import { CopyInterface } from "common/src/logic/CopyInterface";
import { MenuDto } from "common/src/models/MenuDto";

/**
 * Represents the Menu entity in the database.
 * Maps to the 'menus' table and implements the MenuDto and CopyInterface<MenuDto>.
 */
@Entity("menus")
export class MenuEntity implements MenuDto, CopyInterface<MenuDto> {
    /**
     * The unique identifier for the Menu.
     * @type {string}
     */
    @PrimaryColumn({ name: "guid", type: "uuid" })
    public guid: string = "";

    /**
     * The GUID of the parent Menu.
     * @type {string | null}
     */
    @Column({ name: "parents_guid", type: "uuid", nullable: true })
    public parentsGuid: string | null = null;

    /**
     * The order of the Menu in the hierarchy.
     * @type {number}
     */
    @Column({ name: "order", type: "int" })
    public order: number = 0;

    /**
     * The display name of the Menu.
     * @type {string}
     */
    @Column({ name: "display", type: "varchar", length: 100 })
    public display: string = "";

    /**
     * The Bootstrap icon class associated with the Menu.
     * @type {string}
     */
    @Column({ name: "bootstrap_icon", type: "varchar", length: 100 })
    public bootstrapIcon: string = "";

    /**
     * The URL that the Menu points to.
     * @type {string}
     */
    @Column({ name: "url", type: "varchar", length: 250 })
    public url: string = "";

    /**
     * Copies properties from the source MenuDto to this instance.
     * @param {MenuDto} source - The source MenuDto to copy from.
     */
    public copyFrom(source: MenuDto): void {
        this.guid = source.guid;
        this.parentsGuid = source.parentsGuid;
        this.order = source.order;
        this.display = source.display;
        this.bootstrapIcon = source.bootstrapIcon;
        this.url = source.url;
    }

    /**
     * Copies properties from this instance to the destination MenuDto.
     * @param {MenuDto} dest - The destination MenuDto to copy to.
     */
    public copyTo(dest: MenuDto): void {
        dest.guid = this.guid;
        dest.parentsGuid = this.parentsGuid;
        dest.order = this.order;
        dest.display = this.display;
        dest.bootstrapIcon = this.bootstrapIcon;
        dest.url = this.url;
    }
}
