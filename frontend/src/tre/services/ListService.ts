import { ListDto } from "common/src/tre/models/ListDto";
import { FetchWrapper } from "./FetchWrapper";
import { ListFilterDto } from "common/src/tre/models/ListFilterDto";
import { UUIDv4 } from "common/src/tre/logic/UUIDv4";

export class ListService {
    /**
     * Fetches items from a specific list.
     * @param token - Authentication token.
     * @param guid - The unique identifier of the list.
     * @param filters - An array of filters to apply to the item retrieval.
     * @returns A promise that resolves to an array of items.
     */
    public static async getItems(token: string, guid: string, filters: ListFilterDto[]): Promise<any[]> {
        const ret = await FetchWrapper.post<any>({
            url: "/api/v0/list/" + guid + "/items",
            body: filters,
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    /**
     * Fetches the details of a specific list.
     * @param token - Authentication token.
     * @param guid - The unique identifier of the list.
     * @returns A promise that resolves to a ListDto object.
     */
    public static async get(token: string, guid: string): Promise<ListDto> {
        const ret = await FetchWrapper.get<ListDto>({
            url: "/api/v0/list/" + guid,
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    /**
     * Fetches a list by its URL key.
     * @param token - Authentication token.
     * @param key - The URL key of the list.
     * @returns A promise that resolves to a ListDto object.
     */
    public static async getUrlKey(token: string, key: string): Promise<ListDto> {
        const ret = await FetchWrapper.get<ListDto>({
            url: "/api/v0/list/url_key/" + key,
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    /**
     * Fetches all lists accessible to the user.
     * @param token - Authentication token.
     * @returns A promise that resolves to an array of ListDto objects.
     */
    public static async list(token: string): Promise<ListDto[]> {
        const ret = await FetchWrapper.get<ListDto[]>({
            url: "/api/v0/lists",
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    /**
     * Saves a new list or updates an existing one.
     * @param token - Authentication token.
     * @param dto - The ListDto object containing list data.
     * @returns A promise that resolves when the save operation is complete.
     */
    public static async save(token: string, dto: ListDto): Promise<void> {
        await FetchWrapper.post({
            url: "/api/v0/list",
            body: dto,
            corelation: UUIDv4.generate(),
            token: token
        });
    }

    /**
     * Deletes a list.
     * @param token - Authentication token.
     * @param guid - The unique identifier of the list to delete.
     * @returns A promise that resolves when the delete operation is complete.
     */
    public static async delete(token: string, guid: string): Promise<void> {
        await FetchWrapper.delete({
            url: "/api/v0/list/" + guid,
            corelation: UUIDv4.generate(),
            token: token
        });
    }
}
