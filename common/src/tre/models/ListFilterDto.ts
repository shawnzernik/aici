/**
 * Interface representing a list filter data transfer object.
 */
export interface ListFilterDto {
    /** The unique identifier for the filter. */
    guid: string;
    /** The GUID of the associated lists. */
    listsGuid: string;
    /** The label for the filter. */
    label: string;
    /** The SQL column associated with the filter. */
    sqlColumn: string;
    /** The SQL type of the filter. */
    sqlType: string;
    /** Optional SQL query for the filter options. */
    optionsSql?: string;
    /** Optional default comparison operator for the filter. */
    defaultCompare?: string;
    /** Optional default value for the filter. */
    defaultValue?: string;
}
