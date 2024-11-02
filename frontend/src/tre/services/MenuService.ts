import { MenuDto } from "common/src/tre/models/MenuDto";
import { FetchWrapper } from "./FetchWrapper";
import { UUIDv4 } from "common/src/tre/logic/UUIDv4";

/**
 * Service class for managing menu-related operations.
 */
export class MenuService {
    /**
     * Retrieves a menu by its GUID.
     * @param token - Authentication token.
     * @param guid - The GUID of the menu.
     * @returns A Promise that resolves to a MenuDto object.
     */
    public static async get(token: string, guid: string): Promise<MenuDto> {
        const ret = await FetchWrapper.get<MenuDto>({
            url: "/api/v0/menu/" + guid,
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    /**
     * Retrieves a list of menus.
     * @param token - Authentication token.
     * @returns A Promise that resolves to an array of MenuDto objects.
     */
    public static async list(token: string): Promise<MenuDto[]> {
        const ret = await FetchWrapper.get<MenuDto[]>({
            url: "/api/v0/menus",
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    /**
     * Saves a menu.
     * @param token - Authentication token.
     * @param dto - The MenuDto object to save.
     * @returns A Promise that resolves when the operation is complete.
     */
    public static async save(token: string, dto: MenuDto): Promise<void> {
        await FetchWrapper.post({
            url: "/api/v0/menu",
            body: dto, corelation: UUIDv4.generate(),
            token: token
        });
    }

    /**
     * Deletes a menu by its GUID.
     * @param token - Authentication token.
     * @param guid - The GUID of the menu to delete.
     * @returns A Promise that resolves when the operation is complete.
     */
    public static async delete(token: string, guid: string): Promise<void> {
        await FetchWrapper.delete({
            url: "/api/v0/menu/" + guid,
            corelation: UUIDv4.generate(),
            token: token
        });
    }
}
