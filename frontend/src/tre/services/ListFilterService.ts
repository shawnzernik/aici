import { ListFilterDto } from "common/src/tre/models/ListFilterDto";
import { FetchWrapper } from "./FetchWrapper";
import { UUIDv4 } from "common/src/tre/logic/UUIDv4";

export class ListFilterService {
    public static async get(token: string, guid: string): Promise<ListFilterDto> {
        const ret = await FetchWrapper.get<ListFilterDto>({
            url: "/api/v0/list_filter/" + guid,
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

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

    public static async save(token: string, dto: ListFilterDto): Promise<void> {
        await FetchWrapper.post({
            url: "/api/v0/list_filter",
            body: dto,
            corelation: UUIDv4.generate(),
            token: token
        });
    }

    public static async delete(token: string, guid: string): Promise<void> {
        await FetchWrapper.delete({
            url: "/api/v0/list_filter/" + guid,
            corelation: UUIDv4.generate(),
            token: token
        });
    }
}