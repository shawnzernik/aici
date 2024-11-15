export interface ListFilterDto {
    guid: string;
    listsGuid: string;
    label: string;
    sqlColumn: string;
    sqlType: string;
    optionsSql?: string;
    defaultCompare?: string;
    defaultValue?: string;
}