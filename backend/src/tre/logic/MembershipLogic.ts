import { MembershipDto } from "common/src/tre/models/MembershipDto";
import { EntitiesDataSource } from "../data/EntitiesDataSource";

export class MembershipLogic {
    private entity: MembershipDto;

    public constructor(entity: MembershipDto) {
        this.entity = entity;
    }

    public static async getGroupMemberships(eds: EntitiesDataSource, guid: string): Promise<MembershipDto[]> {
        const sql = `
SELECT
    g.guid AS "groupsGuid",
    u.guid AS "usersGuid",
    CASE 
        WHEN m.guid IS NOT NULL THEN m.guid
        ELSE uuid_generate_v4()
    END AS "guid",
    CASE 
        WHEN m.guid IS NOT NULL THEN m.is_included
        ELSE false
    END AS "isIncluded"
FROM
    "groups" g
    LEFT JOIN "users" u ON 1=1
    LEFT JOIN memberships m ON m.users_guid = u.guid AND g.guid = m.groups_guid
WHERE
    g.guid = $1
ORDER BY
    g.display_name, u.email_address 
        `;
        const params: any[] = [guid];

        try {
            const rows = await eds.executeSql(sql, params);
            return rows as MembershipDto[];
        } catch (error) {
            throw new Error(`Failed to retrieve group memberships: ${(error as Error).message}`);
        }
    }

    public static async getUserMemberships(eds: EntitiesDataSource, guid: string): Promise<MembershipDto[]> {
        const sql = `
SELECT
    g.guid AS "groupsGuid",
    u.guid AS "usersGuid",
    CASE 
        WHEN m.guid IS NOT NULL THEN m.guid
        ELSE uuid_generate_v4()
    END AS "guid",
    CASE 
        WHEN m.guid IS NOT NULL THEN m.is_included
        ELSE false
    END AS "isIncluded"
FROM
    "groups" g
    LEFT JOIN "users" u ON 1=1
    LEFT JOIN memberships m ON m.users_guid = u.guid AND g.guid = m.groups_guid
WHERE
    u.guid = $1
ORDER BY
    g.display_name, u.email_address 
        `;
        const params: any[] = [guid];

        try {
            const rows = await eds.executeSql(sql, params);
            return rows as MembershipDto[];
        } catch (error) {
            throw new Error(`Failed to retrieve user memberships: ${(error as Error).message}`);
        }
    }
}