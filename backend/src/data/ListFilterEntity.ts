import { Entity, PrimaryColumn, Column } from 'typeorm';
import { CopyInterface } from "common/src/logic/CopyInterface";
import { ListFilterDto } from "common/src/models/ListFilterDto";

/**
 * Represents a List Filter entity in the database.
 */
@Entity('list_filters')
export class ListFilterEntity implements ListFilterDto, CopyInterface<ListFilterDto> {
    /**
     * The unique identifier for the list filter.
     */
    @PrimaryColumn({ name: "guid" })
    public guid: string = "";

    /**
     * The GUID of the associated list.
     */
    @Column({ name: 'lists_guid' })
    public listsGuid: string = "";

    /**
     * The label of the list filter.
     */
    @Column({ name: 'label' })
    public label: string = "";

    /**
     * The SQL column associated with the list filter.
     */
    @Column({ name: 'sql_column' })
    public sqlColumn: string = "";

    /**
     * The SQL type of the list filter.
     */
    @Column({ name: 'sql_type' })
    public sqlType: string = "";

    /**
     * The SQL query options for the list filter.
     */
    @Column({ name: 'options_sql', type: 'text', nullable: true })
    public optionsSql?: string = "";

    /**
     * The default comparison operator for the list filter.
     */
    @Column({ name: 'default_compare', nullable: true })
    public defaultCompare?: string = "";

    /**
     * The default value for the list filter.
     */
    @Column({ name: 'default_value', nullable: true })
    public defaultValue?: string = "";

    /**
     * Copies properties from a source ListFilterDto to this instance.
     * @param source - The source ListFilterDto object to copy from.
     */
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

    /**
     * Copies properties from this instance to a destination ListFilterDto.
     * @param dest - The destination ListFilterDto object to copy to.
     */
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