import { ListDto } from "common/src/tre/models/ListDto";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { ListFilterDto } from "common/src/tre/models/ListFilterDto";

export class ListLogic {
    private entity: ListDto;

    public constructor(entity: ListDto) {
        this.entity = entity;
    }

    public async getItems(eds: EntitiesDataSource, filters: ListFilterDto[]): Promise<any[]> {
        let sql = ` SELECT * FROM (\n\n${this.entity.sql}\n\n) tbl WHERE 1=1 `;
        const params: any[] = [];

        filters.forEach((filter) => {
            sql = sql + this.addFilterToParams(filter, params);
        });

        const rows = await eds.executeSql(sql, params);
        return rows;
    }

    private addFilterToParams(filter: ListFilterDto, params: any[]): string {
        if (!filter.defaultCompare)
            throw new Error("Default compare is not set!");

        let value: any;
        let where = ` AND tbl."${filter.sqlColumn}" `;
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