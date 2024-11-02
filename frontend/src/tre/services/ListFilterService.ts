import { ListFilterDto } from "common/src/tre/models/ListFilterDto";
import { FetchWrapper } from "./FetchWrapper";
import { UUIDv4 } from "common/src/tre/logic/UUIDv4";

/**
 * Service class for managing list filters.
 */
export class ListFilterService {
    /**
     * Retrieves a specific list filter by its GUID.
     * @param token - Authorization token.
     * @param guid - The GUID of the list filter.
     * @returns A promise that resolves to the ListFilterDto object.
     */
    public static async get(token: string, guid: string): Promise<ListFilterDto> {
        const ret = await FetchWrapper.get<ListFilterDto>({
            url: "/api/v0/list_filter/" + guid,
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    /**
     * Retrieves a list of all list filters.
     * @param token - Authorization token.
     * @returns A promise that resolves to an array of ListFilterDto objects.
     */
    public static async list(token: string): Promise<ListFilterDto[]> {
        const ret = await FetchWrapper.get<ListFilterDto[]>({
            url: "/api/v0/list_filters",
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    public static async listByParentList(token: string, guid: string): Promise<ListFilterDto[]> {
        const ret = await FetchWrapper.get<ListFilterDto[]>({
            url: `/api/v0/list/${guid}/filters`,
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    /**
     * Saves a list filter.
     * @param token - Authorization token.
     * @param dto - The ListFilterDto object to save.
     * @returns A promise that resolves when the operation is complete.
     */
    public static async save(token: string, dto: ListFilterDto): Promise<void> {
        await FetchWrapper.post({
            url: "/api/v0/list_filter",
            body: dto,
            corelation: UUIDv4.generate(),
            token: token
        });
    }

    /**
     * Deletes a list filter by its GUID.
     * @param token - Authorization token.
     * @param guid - The GUID of the list filter to delete.
     * @returns A promise that resolves when the operation is complete.
     */
    public static async delete(token: string, guid: string): Promise<void> {
        await FetchWrapper.delete({
            url: "/api/v0/list_filter/" + guid,
            corelation: UUIDv4.generate(),
            token: token
        });
    }
}
