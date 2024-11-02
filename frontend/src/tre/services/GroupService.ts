import { GroupDto } from "common/src/tre/models/GroupDto";
import { FetchWrapper } from "./FetchWrapper";
import { UUIDv4 } from "common/src/tre/logic/UUIDv4";

/**
 * Service class to handle operations related to Groups.
 */
export class GroupService {
    /**
     * Retrieves a single group by its GUID.
     * @param token - The authentication token.
     * @param guid - The unique identifier of the group.
     * @returns A Promise that resolves to a GroupDto object.
     */
    public static async get(token: string, guid: string): Promise<GroupDto> {
        const ret = await FetchWrapper.get<GroupDto>({
            url: "/api/v0/group/" + guid,
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    /**
     * Retrieves a list of all groups.
     * @param token - The authentication token.
     * @returns A Promise that resolves to an array of GroupDto objects.
     */
    public static async list(token: string): Promise<GroupDto[]> {
        const ret = await FetchWrapper.get<GroupDto[]>({
            url: "/api/v0/groups",
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    /**
     * Saves a new group or updates an existing group.
     * @param token - The authentication token.
     * @param dto - The GroupDto object to be saved.
     * @returns A Promise that resolves when the operation is complete.
     */
    public static async save(token: string, dto: GroupDto): Promise<void> {
        await FetchWrapper.post({
            url: "/api/v0/group",
            body: dto,
            corelation: UUIDv4.generate(),
            token: token
        });
    }

    /**
     * Deletes a group by its GUID.
     * @param token - The authentication token.
     * @param guid - The unique identifier of the group.
     * @returns A Promise that resolves when the operation is complete.
     */
    public static async delete(token: string, guid: string): Promise<void> {
        await FetchWrapper.delete({
            url: "/api/v0/group/" + guid,
            corelation: UUIDv4.generate(),
            token: token
        });
    }
}
