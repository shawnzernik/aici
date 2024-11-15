import { SecurableDto } from "common/src/tre/models/SecurableDto";
import { FetchWrapper } from "./FetchWrapper";
import { UUIDv4 } from "common/src/tre/logic/UUIDv4";

export class SecurableService {
    public static async get(token: string, guid: string): Promise<SecurableDto> {
        const ret = await FetchWrapper.get<SecurableDto>({
            url: "/api/v0/securable/" + guid,
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    public static async list(token: string): Promise<SecurableDto[]> {
        const ret = await FetchWrapper.get<SecurableDto[]>({
            url: "/api/v0/securables",
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    public static async save(token: string, dto: SecurableDto): Promise<void> {
        await FetchWrapper.post({
            url: "/api/v0/securable",
            body: dto,
            corelation: UUIDv4.generate(),
            token: token
        });
    }

    public static async delete(token: string, guid: string): Promise<void> {
        await FetchWrapper.delete({
            url: "/api/v0/securable/" + guid,
            corelation: UUIDv4.generate(),
            token: token
        });
    }
}