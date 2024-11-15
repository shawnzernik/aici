import { MenuDto } from "common/src/tre/models/MenuDto";
import { FetchWrapper } from "./FetchWrapper";
import { UUIDv4 } from "common/src/tre/logic/UUIDv4";

export class MenuService {
    public static async get(token: string, guid: string): Promise<MenuDto> {
        const ret = await FetchWrapper.get<MenuDto>({
            url: "/api/v0/menu/" + guid,
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    public static async list(token: string): Promise<MenuDto[]> {
        const ret = await FetchWrapper.get<MenuDto[]>({
            url: "/api/v0/menus",
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    public static async save(token: string, dto: MenuDto): Promise<void> {
        await FetchWrapper.post({
            url: "/api/v0/menu",
            body: dto, corelation: UUIDv4.generate(),
            token: token
        });
    }

    public static async delete(token: string, guid: string): Promise<void> {
        await FetchWrapper.delete({
            url: "/api/v0/menu/" + guid,
            corelation: UUIDv4.generate(),
            token: token
        });
    }
}
