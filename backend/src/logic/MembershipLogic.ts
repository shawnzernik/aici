import { MembershipDto } from "common/src/models/MembershipDto";
import { EntitiesDataSource } from "../data/EntitiesDataSource";

/**
 * Handles logic related to group and user memberships.
 */
export class MembershipLogic {
    /**
     * The membership entity containing membership details.
     */
    private entity: MembershipDto;

    /**
     * Creates an instance of MembershipLogic.
     * @param entity The membership data transfer object.
     */
    public constructor(entity: MembershipDto) {
        this.entity = entity;
    }

    /**
     * Retrieves all memberships for a specific group.
     * @param eds The data source for executing SQL queries.
     * @param guid The unique identifier of the group.
     * @returns A promise that resolves to an array of MembershipDto objects representing the group's memberships.
     * @throws Will throw an error if the SQL query fails.
     */
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

    /**
     * Retrieves all memberships for a specific user.
     * @param eds The data source for executing SQL queries.
     * @param guid The unique identifier of the user.
     * @returns A promise that resolves to an array of MembershipDto objects representing the user's memberships.
     * @throws Will throw an error if the SQL query fails.
     */
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
