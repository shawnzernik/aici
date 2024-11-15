import { ListDto } from "common/src/tre/models/ListDto";
import { FetchWrapper } from "./FetchWrapper";
import { ListFilterDto } from "common/src/tre/models/ListFilterDto";
import { UUIDv4 } from "common/src/tre/logic/UUIDv4";

export class ListService {
    public static async getItems(token: string, guid: string, filters: ListFilterDto[]): Promise<any[]> {
        const ret = await FetchWrapper.post<any>({
            url: "/api/v0/list/" + guid + "/items",
            body: filters,
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    public static async get(token: string, guid: string): Promise<ListDto> {
        const ret = await FetchWrapper.get<ListDto>({
            url: "/api/v0/list/" + guid,
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    public static async getUrlKey(token: string, key: string): Promise<ListDto> {
        const ret = await FetchWrapper.get<ListDto>({
            url: "/api/v0/list/url_key/" + key,
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    public static async list(token: string): Promise<ListDto[]> {
        const ret = await FetchWrapper.get<ListDto[]>({
            url: "/api/v0/lists",
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    public static async save(token: string, dto: ListDto): Promise<void> {
        await FetchWrapper.post({
            url: "/api/v0/list",
            body: dto,
            corelation: UUIDv4.generate(),
            token: token
        });
    }

    public static async delete(token: string, guid: string): Promise<void> {
        await FetchWrapper.delete({
            url: "/api/v0/list/" + guid,
            corelation: UUIDv4.generate(),
            token: token
        });
    }
}
