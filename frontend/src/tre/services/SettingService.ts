import { SettingDto } from "common/src/tre/models/SettingDto";
import { FetchWrapper } from "./FetchWrapper";
import { UUIDv4 } from "common/src/tre/logic/UUIDv4";

export class SettingService {
    public static async get(token: string, guid: string): Promise<SettingDto> {
        const ret = await FetchWrapper.get<SettingDto>({
            url: "/api/v0/setting/" + guid,
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }
    public static async getKey(token: string, key: string): Promise<SettingDto> {
        const ret = await FetchWrapper.post<SettingDto>({
            url: "/api/v0/setting/key",
            body: { "key": key },
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    public static async list(token: string): Promise<SettingDto[]> {
        const ret = await FetchWrapper.get<SettingDto[]>({
            url: "/api/v0/settings",
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    public static async save(token: string, dto: SettingDto): Promise<void> {
        await FetchWrapper.post({
            url: "/api/v0/setting",
            body: dto,
            corelation: UUIDv4.generate(),
            token: token
        });
    }

    public static async delete(token: string, guid: string): Promise<void> {
        await FetchWrapper.delete({
            url: "/api/v0/setting/" + guid,
            corelation: UUIDv4.generate(),
            token: token
        });
    }
}