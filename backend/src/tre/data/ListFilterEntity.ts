import { Entity, PrimaryColumn, Column } from "typeorm";
import { CopyInterface } from "common/src/tre/logic/CopyInterface";
import { ListFilterDto } from "common/src/tre/models/ListFilterDto";

@Entity("list_filters")
export class ListFilterEntity implements ListFilterDto, CopyInterface<ListFilterDto> {
    @PrimaryColumn({ name: "guid" })
    public guid: string = "";

    @Column({ name: "lists_guid" })
    public listsGuid: string = "";

    @Column({ name: "label" })
    public label: string = "";

    @Column({ name: "sql_column" })
    public sqlColumn: string = "";

    @Column({ name: "sql_type" })
    public sqlType: string = "";

    @Column({ name: "options_sql", type: "text", nullable: true })
    public optionsSql?: string = "";

    @Column({ name: "default_compare", nullable: true })
    public defaultCompare?: string = "";

    @Column({ name: "default_value", nullable: true })
    public defaultValue?: string = "";

    public copyFrom(source: ListFilterDto): void {
        this.guid = source.guid;
        this.listsGuid = source.listsGuid;
        this.label = source.label;
        this.sqlColumn = source.sqlColumn;
        this.sqlType = source.sqlType;
        this.optionsSql = source.optionsSql;
        this.defaultCompare = source.defaultCompare;
        this.defaultValue = source.defaultValue;
    }

    public copyTo(dest: ListFilterDto): void {
        dest.guid = this.guid;
        dest.listsGuid = this.listsGuid;
        dest.label = this.label;
        dest.sqlColumn = this.sqlColumn;
        dest.sqlType = this.sqlType;
        dest.optionsSql = this.optionsSql;
        dest.defaultCompare = this.defaultCompare;
        dest.defaultValue = this.defaultValue;
    }
}