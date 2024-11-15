import { Entity, PrimaryColumn, Column } from "typeorm";
import { CopyInterface } from "common/src/tre/logic/CopyInterface";
import { MenuDto } from "common/src/tre/models/MenuDto";

@Entity("menus")
export class MenuEntity implements MenuDto, CopyInterface<MenuDto> {
    @PrimaryColumn({ name: "guid", type: "uuid" })
    public guid: string = "";

    @Column({ name: "parents_guid", type: "uuid", nullable: true })
    public parentsGuid: string | null = null;

    @Column({ name: "order", type: "int" })
    public order: number = 0;

    @Column({ name: "display", type: "varchar", length: 100 })
    public display: string = "";

    @Column({ name: "bootstrap_icon", type: "varchar", length: 100 })
    public bootstrapIcon: string = "";

    @Column({ name: "url", type: "varchar", length: 250 })
    public url: string = "";

    public copyFrom(source: MenuDto): void {
        this.guid = source.guid;
        this.parentsGuid = source.parentsGuid;
        this.order = source.order;
        this.display = source.display;
        this.bootstrapIcon = source.bootstrapIcon;
        this.url = source.url;
    }

    public copyTo(dest: MenuDto): void {
        dest.guid = this.guid;
        dest.parentsGuid = this.parentsGuid;
        dest.order = this.order;
        dest.display = this.display;
        dest.bootstrapIcon = this.bootstrapIcon;
        dest.url = this.url;
    }
}