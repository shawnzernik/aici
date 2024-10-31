import { ListDto } from "common/src/models/ListDto";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { ListFilterDto } from "common/src/models/ListFilterDto";

/**
 * Handles logic related to retrieving and filtering list items from the database.
 */
export class ListLogic {
    /**
     * The list entity containing SQL query and related metadata.
     */
    private entity: ListDto;

    /**
     * Creates an instance of ListLogic.
     * @param entity The list entity containing the base SQL query.
     */
    public constructor(entity: ListDto) {
        this.entity = entity;
    }

    /**
     * Retrieves items from the database based on the provided filters.
     * @param eds The data source for executing SQL queries.
     * @param filters An array of filter criteria to apply to the SQL query.
     * @returns A promise that resolves to an array of retrieved items.
     */
    public async getItems(eds: EntitiesDataSource, filters: ListFilterDto[]): Promise<any[]> {
        let sql = ` SELECT * FROM (${this.entity.sql}) WHERE 1=1 `;
        const params: any[] = [];

        filters.forEach((filter) => {
            sql = sql + this.addFilterToParams(filter, params);
        });

        const rows = await eds.executeSql(sql, params);
        return rows;
    }

    /**
     * Adds a filter condition to the SQL query and updates the parameters array.
     * @param filter The filter criteria to apply.
     * @param params The array of parameters to be used in the SQL query.
     * @returns A string representing the SQL condition for the filter.
     * @throws Will throw an error if the default comparison operator is not set or unknown.
     */
    private addFilterToParams(filter: ListFilterDto, params: any[]): string {
        if (!filter.defaultCompare)
            throw new Error("Default compare is not set!");

        let value: any;
        let where = ` AND ${filter.sqlColumn} `;
        switch (filter.defaultCompare) {
            case "e":
                value = convertDefaultValueToJsType(filter);
                params.push(value);
                where = where + ` = $${params.length} `;
                break;
            case "ne":
                value = convertDefaultValueToJsType(filter);
                params.push(value);
                where = where + ` <> $${params.length} `;
                break;
            case "gt":
                value = convertDefaultValueToJsType(filter);
                params.push(value);
                where = where + ` > $${params.length} `;
                break;
            case "gte":
                value = convertDefaultValueToJsType(filter);
                params.push(value);
                where = where + ` >= $${params.length} `;
                break;
            case "lt":
                value = convertDefaultValueToJsType(filter);
                params.push(value);
                where = where + ` < $${params.length} `;
                break;
            case "lte":
                value = convertDefaultValueToJsType(filter);
                params.push(value);
                where = where + ` <= $${params.length} `;
                break;
            case "n":
                where = where + ` IS NULL `;
                break;
            case "nn":
                where = where + ` IS NOT NULL `;
                break;
            case "c":
                value = convertDefaultValueToJsType(filter);
                params.push(value);
                where = where + ` LIKE CONCAT('%', $${params.length}::text, '%') `;
                break;
            case "dnc":
                value = convertDefaultValueToJsType(filter);
                params.push(value);
                where = where + ` NOT LIKE CONCAT('%', $${params.length}::text, '%') `;
                break;
            default:
                throw new Error(`Unknown compare - ${filter.defaultCompare}!`);
        }

        return where;
    }
}

/**
 * Converts the default value from the filter to the appropriate JavaScript type based on the SQL type.
 * @param filter The filter containing the default value and SQL type.
 * @returns The converted value in JavaScript type.
 * @throws Will throw an error if the default value is undefined, null, or if the SQL type is unknown.
 */
function convertDefaultValueToJsType(filter: ListFilterDto): any {
    if (filter.defaultValue === undefined || filter.defaultValue === null)
        throw new Error("Default value is undefined or null!");

    switch (filter.sqlType.toLowerCase()) {
        case "varchar":
            return filter.defaultValue;
        case "int":
            return Number.parseInt(filter.defaultValue);
        default:
            throw new Error(`Unknown sql type - ${filter.sqlType}!`);
    }
}
