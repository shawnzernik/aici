import { MembershipDto } from "common/src/tre/models/MembershipDto";
import { FetchWrapper } from "./FetchWrapper";
import { UUIDv4 } from "common/src/tre/logic/UUIDv4";

export class MembershipService {
    public static async getForGroup(token: string, guid: string): Promise<MembershipDto[]> {
        const ret = await FetchWrapper.get<MembershipDto[]>({
            url: "/api/v0/group/" + guid + "/memberships",
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    public static async getForUser(token: string, guid: string): Promise<MembershipDto[]> {
        const ret = await FetchWrapper.get<MembershipDto[]>({
            url: "/api/v0/user/" + guid + "/memberships",
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    public static async get(token: string, guid: string): Promise<MembershipDto> {
        const ret = await FetchWrapper.get<MembershipDto>({
            url: "/api/v0/membership/" + guid,
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    public static async list(token: string): Promise<MembershipDto[]> {
        const ret = await FetchWrapper.get<MembershipDto[]>({
            url: "/api/v0/memberships",
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    public static async save(token: string, entity: MembershipDto): Promise<void> {
        await FetchWrapper.post({
            url: "/api/v0/membership",
            body: entity,
            corelation: UUIDv4.generate(),
            token: token
        });
    }

    public static async delete(token: string, guid: string): Promise<void> {
        await FetchWrapper.delete({
            url: "/api/v0/membership/" + guid,
            corelation: UUIDv4.generate(),
            token: token
        });
    }
}