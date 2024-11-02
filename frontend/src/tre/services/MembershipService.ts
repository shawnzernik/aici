import { MembershipDto } from "common/src/tre/models/MembershipDto";
import { FetchWrapper } from "./FetchWrapper";
import { UUIDv4 } from "common/src/tre/logic/UUIDv4";

/**
 * Service class to handle membership related operations.
 */
export class MembershipService {
    /**
     * Retrieves a list of memberships for a specific group.
     * @param token - The authentication token.
     * @param guid - The unique identifier of the group.
     * @returns A promise that resolves to an array of MembershipDto objects.
     */
    public static async getForGroup(token: string, guid: string): Promise<MembershipDto[]> {
        const ret = await FetchWrapper.get<MembershipDto[]>({
            url: "/api/v0/group/" + guid + "/memberships",
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    /**
     * Retrieves a list of memberships for a specific user.
     * @param token - The authentication token.
     * @param guid - The unique identifier of the user.
     * @returns A promise that resolves to an array of MembershipDto objects.
     */
    public static async getForUser(token: string, guid: string): Promise<MembershipDto[]> {
        const ret = await FetchWrapper.get<MembershipDto[]>({
            url: "/api/v0/user/" + guid + "/memberships",
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    /**
     * Retrieves a specific membership by its identifier.
     * @param token - The authentication token.
     * @param guid - The unique identifier of the membership.
     * @returns A promise that resolves to a MembershipDto object.
     */
    public static async get(token: string, guid: string): Promise<MembershipDto> {
        const ret = await FetchWrapper.get<MembershipDto>({
            url: "/api/v0/membership/" + guid,
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    /**
     * Retrieves a list of all memberships for the authenticated user.
     * @param token - The authentication token.
     * @returns A promise that resolves to an array of MembershipDto objects.
     */
    public static async list(token: string): Promise<MembershipDto[]> {
        const ret = await FetchWrapper.get<MembershipDto[]>({
            url: "/api/v0/memberships",
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    /**
     * Saves a new or updated membership entity.
     * @param token - The authentication token.
     * @param entity - The MembershipDto object to save.
     * @returns A promise that resolves when the save operation is complete.
     */
    public static async save(token: string, entity: MembershipDto): Promise<void> {
        await FetchWrapper.post({
            url: "/api/v0/membership",
            body: entity,
            corelation: UUIDv4.generate(),
            token: token
        });
    }

    /**
     * Deletes a specific membership by its identifier.
     * @param token - The authentication token.
     * @param guid - The unique identifier of the membership.
     * @returns A promise that resolves when the delete operation is complete.
     */
    public static async delete(token: string, guid: string): Promise<void> {
        await FetchWrapper.delete({
            url: "/api/v0/membership/" + guid,
            corelation: UUIDv4.generate(),
            token: token
        });
    }
}
