import { PermissionDto } from "common/src/tre/models/PermissionDto";
import { FetchWrapper } from "./FetchWrapper";
import { UUIDv4 } from "common/src/tre/logic/UUIDv4";

/**
 * Service to manage permissions.
 */
export class PermissionService {
    /**
     * Retrieves a list of permissions for a specific group.
     * @param token - Authentication token.
     * @param guid - The group's identifier.
     * @returns A promise that resolves to an array of PermissionDto.
     */
    public static async getForGroup(token: string, guid: string): Promise<PermissionDto[]> {
        const ret = await FetchWrapper.get<PermissionDto[]>({
            url: "/api/v0/group/" + guid + "/permissions",
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    /**
     * Retrieves a list of permissions for a specific securable entity.
     * @param token - Authentication token.
     * @param guid - The securable entity's identifier.
     * @returns A promise that resolves to an array of PermissionDto.
     */
    public static async getForSecurable(token: string, guid: string): Promise<PermissionDto[]> {
        const ret = await FetchWrapper.get<PermissionDto[]>({
            url: "/api/v0/securable/" + guid + "/permissions",
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    /**
     * Retrieves a specific permission by its identifier.
     * @param token - Authentication token.
     * @param guid - The permission's identifier.
     * @returns A promise that resolves to a PermissionDto.
     */
    public static async get(token: string, guid: string): Promise<PermissionDto> {
        const ret = await FetchWrapper.get<PermissionDto>({
            url: "/api/v0/permission/" + guid,
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    /**
     * Retrieves a list of all permissions.
     * @param token - Authentication token.
     * @returns A promise that resolves to an array of PermissionDto.
     */
    public static async list(token: string): Promise<PermissionDto[]> {
        const ret = await FetchWrapper.get<PermissionDto[]>({
            url: "/api/v0/permissions",
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    /**
     * Saves a permission.
     * @param token - Authentication token.
     * @param dto - The permission data transfer object to save.
     * @returns A promise that resolves when the save operation is complete.
     */
    public static async save(token: string, dto: PermissionDto): Promise<void> {
        await FetchWrapper.post({
            url: "/api/v0/permission",
            body: dto,
            corelation: UUIDv4.generate(),
            token: token
        });
    }

    /**
     * Deletes a permission by its identifier.
     * @param token - Authentication token.
     * @param guid - The permission's identifier.
     * @returns A promise that resolves when the delete operation is complete.
     */
    public static async delete(token: string, guid: string): Promise<void> {
        await FetchWrapper.delete({
            url: "/api/v0/permission/" + guid,
            corelation: UUIDv4.generate(),
            token: token
        });
    }
}
