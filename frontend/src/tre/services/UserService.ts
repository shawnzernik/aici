import { UserDto } from "common/src/tre/models/UserDto";
import { FetchWrapper } from "./FetchWrapper";
import { UUIDv4 } from "common/src/tre/logic/UUIDv4";

/**
 * Service class for handling user-related operations.
 */
export class UserService {
    /**
     * Retrieves a user by GUID.
     * @param token - The authentication token.
     * @param guid - The GUID of the user.
     * @returns A promise that resolves to a UserDto object.
     */
    public static async get(token: string, guid: string): Promise<UserDto> {
        const ret = await FetchWrapper.get<UserDto>({
            url: "/api/v0/user/" + guid,
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    /**
     * Retrieves a list of users.
     * @param token - The authentication token.
     * @returns A promise that resolves to an array of UserDto objects.
     */
    public static async list(token: string): Promise<UserDto[]> {
        const ret = await FetchWrapper.get<UserDto[]>({
            url: "/api/v0/users",
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    /**
     * Saves a user.
     * @param token - The authentication token.
     * @param dto - The UserDto object to save.
     * @returns A promise that resolves when the save operation is complete.
     */
    public static async save(token: string, dto: UserDto): Promise<void> {
        await FetchWrapper.post({
            url: "/api/v0/user",
            body: dto,
            corelation: UUIDv4.generate(),
            token: token
        });
    }

    /**
     * Deletes a user by GUID.
     * @param token - The authentication token.
     * @param guid - The GUID of the user to delete.
     * @returns A promise that resolves when the delete operation is complete.
     */
    public static async delete(token: string, guid: string): Promise<void> {
        await FetchWrapper.delete({
            url: "/api/v0/user/" + guid,
            corelation: UUIDv4.generate(),
            token: token
        });
    }

    /**
     * Resets a user's password.
     * @param token - The authentication token.
     * @param guid - The GUID of the user.
     * @param newPassword - The new password.
     * @param confirmPassword - The confirmation of the new password.
     * @returns A promise that resolves when the password reset operation is complete.
     */
    public static async resetPassword(token: string, guid: string, newPassword: string, confirmPassword: string): Promise<void> {
        const obj = { password: newPassword, confirm: confirmPassword };
        await FetchWrapper.post({
            url: "/api/v0/user/" + guid + "/password",
            body: obj,
            corelation: UUIDv4.generate(),
            token: token
        });
    }
}
