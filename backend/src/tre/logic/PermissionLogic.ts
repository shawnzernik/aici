import { PermissionDto } from "common/src/tre/models/PermissionDto";
import { EntitiesDataSource } from "../data/EntitiesDataSource";

export class PermissionLogic {
    private entity: PermissionDto;

    public constructor(entity: PermissionDto) {
        this.entity = entity;
    }

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