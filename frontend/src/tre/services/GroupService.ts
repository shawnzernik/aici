import { GroupDto } from "common/src/tre/models/GroupDto";
import { FetchWrapper } from "./FetchWrapper";
import { UUIDv4 } from "common/src/tre/logic/UUIDv4";

export class GroupService {
    public static async get(token: string, guid: string): Promise<GroupDto> {
        const ret = await FetchWrapper.get<GroupDto>({
            url: "/api/v0/group/" + guid,
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    public static async list(token: string): Promise<GroupDto[]> {
        const ret = await FetchWrapper.get<GroupDto[]>({
            url: "/api/v0/groups",
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    public static async save(token: string, dto: GroupDto): Promise<void> {
        await FetchWrapper.post({
            url: "/api/v0/group",
            body: dto,
            corelation: UUIDv4.generate(),
            token: token
        });
    }

    public static async delete(token: string, guid: string): Promise<void> {
        await FetchWrapper.delete({
            url: "/api/v0/group/" + guid,
            corelation: UUIDv4.generate(),
            token: token
        });
    }
}