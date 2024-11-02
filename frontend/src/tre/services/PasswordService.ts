import { PasswordDto } from "common/src/tre/models/PasswordDto";
import { FetchWrapper } from "./FetchWrapper";
import { UUIDv4 } from "common/src/tre/logic/UUIDv4";

/**
 * Service class for managing passwords.
 */
export class PasswordService {
    /**
     * Retrieves a password by its GUID.
     * @param token - Authentication token.
     * @param guid - The GUID of the password.
     * @returns A Promise that resolves to a PasswordDto object.
     */
    public static async get(token: string, guid: string): Promise<PasswordDto> {
        const ret = await FetchWrapper.get<PasswordDto>({
            url: "/api/v0/password/" + guid,
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    /**
     * Retrieves a list of all passwords for the authenticated user.
     * @param token - Authentication token.
     * @returns A Promise that resolves to an array of PasswordDto objects.
     */
    public static async list(token: string): Promise<PasswordDto[]> {
        const ret = await FetchWrapper.get<PasswordDto[]>({
            url: "/api/v0/passwords",
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    /**
     * Saves a new password or updates an existing one.
     * @param token - Authentication token.
     * @param dto - The PasswordDto object to save.
     * @returns A Promise that resolves when the save operation is complete.
     */
    public static async save(token: string, dto: PasswordDto): Promise<void> {
        await FetchWrapper.post({
            url: "/api/v0/password",
            body: dto,
            corelation: UUIDv4.generate(),
            token: token
        });
    }

    /**
     * Deletes a password by its GUID.
     * @param token - Authentication token.
     * @param guid - The GUID of the password to delete.
     * @returns A Promise that resolves when the delete operation is complete.
     */
    public static async delete(token: string, guid: string): Promise<void> {
        await FetchWrapper.delete({
            url: "/api/v0/password/" + guid,
            corelation: UUIDv4.generate(),
            token: token
        });
    }
}
