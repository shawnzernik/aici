import { PermissionDto } from "common/src/models/PermissionDto";
import { EntitiesDataSource } from "../data/EntitiesDataSource";

/**
 * Handles logic related to group and securable permissions.
 */
export class PermissionLogic {
    /**
     * The permission entity containing permission details.
     */
    private entity: PermissionDto;

    /**
     * Creates an instance of PermissionLogic.
     * @param entity The permission data transfer object.
     */
    public constructor(entity: PermissionDto) {
        this.entity = entity;
    }

    /**
     * Retrieves all permissions associated with a specific group.
     * 
     * @param eds The data source for executing SQL queries.
     * @param guid The unique identifier of the group.
     * @returns A promise that resolves to an array of PermissionDto objects representing the group's permissions.
     * @throws Will throw an error if the SQL query execution fails.
     */
    public static async getGroupPermissions(eds: EntitiesDataSource, guid: string): Promise<PermissionDto[]> {
        const sql = `
SELECT
    CASE 
        WHEN p.guid IS NOT NULL THEN p.guid
        ELSE uuid_generate_v4()
    END AS "guid",
    g.guid AS "groupsGuid",
    s.guid AS "securablesGuid",
    CASE 
        WHEN p.guid IS NOT NULL THEN p.is_allowed
        ELSE FALSE
    END AS "isAllowed"
FROM 
    "securables" s
    LEFT JOIN "groups" g ON 1=1
    LEFT JOIN permissions p ON p.groups_guid = g.guid AND p.securables_guid = s.guid
WHERE 
    g.guid = $1
ORDER BY
    s.display_name, g.display_name 
        `;
        const params: any[] = [guid];

        try {
            const rows = await eds.executeSql(sql, params);
            return rows as PermissionDto[];
        } catch (error) {
            throw new Error(`Failed to retrieve group permissions: ${(error as Error).message}`);
        }
    }

    /**
     * Retrieves all permissions associated with a specific securable.
     * 
     * @param eds The data source for executing SQL queries.
     * @param guid The unique identifier of the securable.
     * @returns A promise that resolves to an array of PermissionDto objects representing the securable's permissions.
     * @throws Will throw an error if the SQL query execution fails.
     */
    public static async getSecurablePermissions(eds: EntitiesDataSource, guid: string): Promise<PermissionDto[]> {
        const sql = `
SELECT
    CASE 
        WHEN p.guid IS NOT NULL THEN p.guid
        ELSE uuid_generate_v4()
    END AS "guid",
    g.guid AS "groupsGuid",
    s.guid AS "securablesGuid",
    CASE 
        WHEN p.guid IS NOT NULL THEN p.is_allowed
        ELSE FALSE
    END AS "isAllowed"    
FROM 
    "securables" s
    LEFT JOIN "groups" g ON 1=1
    LEFT JOIN permissions p ON p.groups_guid = g.guid AND p.securables_guid = s.guid
WHERE 
    s.guid = $1
ORDER BY
    s.display_name, g.display_name 
        `;
        const params: any[] = [guid];

        try {
            const rows = await eds.executeSql(sql, params);
            return rows as PermissionDto[];
        } catch (error) {
            throw new Error(`Failed to retrieve securable permissions: ${(error as Error).message}`);
        }
    }
}
