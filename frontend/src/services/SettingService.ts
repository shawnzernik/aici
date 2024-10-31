import { SettingDto } from "common/src/models/SettingDto";
import { FetchWrapper } from "./FetchWrapper";
import { UUIDv4 } from "common/src/logic/UUIDv4";

/**
 * Service class for managing settings.
 */
export class SettingService {
    /**
     * Retrieves a single setting by its GUID.
     * @param token - Authentication token.
     * @param guid - The GUID of the setting to retrieve.
     * @returns A Promise that resolves to a SettingDto object.
     */
    public static async get(token: string, guid: string): Promise<SettingDto> {
        const ret = await FetchWrapper.get<SettingDto>({
            url: "/api/v0/setting/" + guid,
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    /**
     * Retrieves a list of settings.
     * @param token - Authentication token.
     * @returns A Promise that resolves to an array of SettingDto objects.
     */
    public static async list(token: string): Promise<SettingDto[]> {
        const ret = await FetchWrapper.get<SettingDto[]>({
            url: "/api/v0/settings",
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    /**
     * Saves a setting.
     * @param token - Authentication token.
     * @param dto - The SettingDto object to save.
     * @returns A Promise that resolves when the save operation is complete.
     */
    public static async save(token: string, dto: SettingDto): Promise<void> {
        await FetchWrapper.post({
            url: "/api/v0/setting",
            body: dto,
            corelation: UUIDv4.generate(),
            token: token
        });
    }

    /**
     * Deletes a setting by its GUID.
     * @param token - Authentication token.
     * @param guid - The GUID of the setting to delete.
     * @returns A Promise that resolves when the delete operation is complete.
     */
    public static async delete(token: string, guid: string): Promise<void> {
        await FetchWrapper.delete({
            url: "/api/v0/setting/" + guid,
            corelation: UUIDv4.generate(),
            token: token
        });
    }
}
