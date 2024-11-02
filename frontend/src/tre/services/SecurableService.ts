import { SecurableDto } from "common/src/tre/models/SecurableDto";
import { FetchWrapper } from "./FetchWrapper";
import { UUIDv4 } from "common/src/tre/logic/UUIDv4";

/**
 * Service class to handle operations related to Securables.
 */
export class SecurableService {
    /**
     * Retrieves a Securable by its GUID.
     * @param token - Authentication token.
     * @param guid - The GUID of the Securable.
     * @returns Promise<SecurableDto> - The Securable DTO.
     */
    public static async get(token: string, guid: string): Promise<SecurableDto> {
        const ret = await FetchWrapper.get<SecurableDto>({
            url: "/api/v0/securable/" + guid,
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    /**
     * Retrieves a list of Securables.
     * @param token - Authentication token.
     * @returns Promise<SecurableDto[]> - Array of Securable DTOs.
     */
    public static async list(token: string): Promise<SecurableDto[]> {
        const ret = await FetchWrapper.get<SecurableDto[]>({
            url: "/api/v0/securables",
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    /**
     * Saves a Securable.
     * @param token - Authentication token.
     * @param dto - The Securable DTO to save.
     * @returns Promise<void>
     */
    public static async save(token: string, dto: SecurableDto): Promise<void> {
        await FetchWrapper.post({
            url: "/api/v0/securable",
            body: dto,
            corelation: UUIDv4.generate(),
            token: token
        });
    }

    /**
     * Deletes a Securable by its GUID.
     * @param token - Authentication token.
     * @param guid - The GUID of the Securable to delete.
     * @returns Promise<void>
     */
    public static async delete(token: string, guid: string): Promise<void> {
        await FetchWrapper.delete({
            url: "/api/v0/securable/" + guid,
            corelation: UUIDv4.generate(),
            token: token
        });
    }
}
