import { PermissionDto } from "common/src/tre/models/PermissionDto";
import { FetchWrapper } from "./FetchWrapper";
import { UUIDv4 } from "common/src/tre/logic/UUIDv4";

export class PermissionService {
    public static async getForGroup(token: string, guid: string): Promise<PermissionDto[]> {
        const ret = await FetchWrapper.get<PermissionDto[]>({
            url: "/api/v0/group/" + guid + "/permissions",
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    public static async getForSecurable(token: string, guid: string): Promise<PermissionDto[]> {
        const ret = await FetchWrapper.get<PermissionDto[]>({
            url: "/api/v0/securable/" + guid + "/permissions",
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    public static async get(token: string, guid: string): Promise<PermissionDto> {
        const ret = await FetchWrapper.get<PermissionDto>({
            url: "/api/v0/permission/" + guid,
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    public static async list(token: string): Promise<PermissionDto[]> {
        const ret = await FetchWrapper.get<PermissionDto[]>({
            url: "/api/v0/permissions",
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    public static async save(token: string, dto: PermissionDto): Promise<void> {
        await FetchWrapper.post({
            url: "/api/v0/permission",
            body: dto,
            corelation: UUIDv4.generate(),
            token: token
        });
    }

    public static async delete(token: string, guid: string): Promise<void> {
        await FetchWrapper.delete({
            url: "/api/v0/permission/" + guid,
            corelation: UUIDv4.generate(),
            token: token
        });
    }
}
