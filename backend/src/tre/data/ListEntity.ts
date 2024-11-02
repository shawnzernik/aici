import { Entity, PrimaryColumn, Column } from 'typeorm';
import { CopyInterface } from "common/src/tre/logic/CopyInterface";
import { ListDto } from "common/src/tre/models/ListDto";

/**
 * Represents a list entity in the database.
 */
@Entity('lists')
export class ListEntity implements ListDto, CopyInterface<ListDto> {
    /**
     * The unique identifier for the list.
     */
    @PrimaryColumn({ name: "guid" })
    public guid: string = "";

    /**
     * The title of the list.
     */
    @Column({ name: 'title' })
    public title: string = "";

    /**
     * The URL key for the list.
     */
    @Column({ name: 'url_key' })
    public urlKey: string = "";

    /**
     * The GUID of the top menu associated with the list.
     */
    @Column({ name: 'top_menu_guid' })
    public topMenuGuid: string = "";

    /**
     * The GUID of the left menu associated with the list.
     */
    @Column({ name: 'left_menu_guid' })
    public leftMenuGuid: string = "";

    /**
     * The SQL query associated with the list.
     */
    @Column({ name: 'sql', type: 'text' })
    public sql: string = "";

    /**
     * The edit URL for the list, if any.
     */
    @Column({ name: 'edit_url', nullable: true })
    public editUrl?: string = "";

    /**
     * Indicates whether the list should beautoloaded.
     */
    @Column({ name: 'autoload', default: false })
    public autoload: boolean = false;

    /**
     * Copies the properties from the source ListDto to this entity.
     * @param source - The source ListDto to copy from.
     */
    public copyFrom(source: ListDto): void {
        this.guid = source.guid;
        this.title = source.title;
        this.urlKey = source.urlKey;
        this.topMenuGuid = source.topMenuGuid;
        this.leftMenuGuid = source.leftMenuGuid;
        this.sql = source.sql;
        this.editUrl = source.editUrl;
        this.autoload = source.autoload;
    }

    /**
     * Copies the properties from this entity to the destination ListDto.
     * @param dest - The destination ListDto to copy to.
     */
    public copyTo(dest: ListDto): void {
        dest.guid = this.guid;
        dest.title = this.title;
        dest.urlKey = this.urlKey;
        dest.topMenuGuid = this.topMenuGuid;
        dest.leftMenuGuid = this.leftMenuGuid;
        dest.sql = this.sql;
        dest.editUrl = this.editUrl;
        dest.autoload = this.autoload;
    }
}