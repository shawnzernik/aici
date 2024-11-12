import { Entity, PrimaryColumn, Column } from "typeorm";
import { CopyInterface } from "common/src/tre/logic/CopyInterface";
import { ListDto } from "common/src/tre/models/ListDto";

@Entity("lists")
export class ListEntity implements ListDto, CopyInterface<ListDto> {
    @PrimaryColumn({ name: "guid" })
    public guid: string = "";

    @Column({ name: "title" })
    public title: string = "";

    @Column({ name: "url_key" })
    public urlKey: string = "";

    @Column({ name: "top_menu_guid" })
    public topMenuGuid: string = "";

    @Column({ name: "left_menu_guid" })
    public leftMenuGuid: string = "";

    @Column({ name: "sql", type: "text" })
    public sql: string = "";

    @Column({ name: "edit_url", nullable: true })
    public editUrl?: string = "";

    @Column({ name: "autoload", default: false })
    public autoload: boolean = false;

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