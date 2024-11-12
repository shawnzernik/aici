import { UserDto } from "common/src/tre/models/UserDto";
import { FetchWrapper } from "./FetchWrapper";
import { UUIDv4 } from "common/src/tre/logic/UUIDv4";

export class UserService {
    public static async get(token: string, guid: string): Promise<UserDto> {
        const ret = await FetchWrapper.get<UserDto>({
            url: "/api/v0/user/" + guid,
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    public static async list(token: string): Promise<UserDto[]> {
        const ret = await FetchWrapper.get<UserDto[]>({
            url: "/api/v0/users",
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    public static async save(token: string, dto: UserDto): Promise<void> {
        await FetchWrapper.post({
            url: "/api/v0/user",
            body: dto,
            corelation: UUIDv4.generate(),
            token: token
        });
    }

    public static async delete(token: string, guid: string): Promise<void> {
        await FetchWrapper.delete({
            url: "/api/v0/user/" + guid,
            corelation: UUIDv4.generate(),
            token: token
        });
    }

    public static async resetPassword(token: string, guid: string, newPassword: string, confirmPassword: string): Promise<void> {
        const obj = { password: newPassword, confirm: confirmPassword };
        await FetchWrapper.post({
            url: "/api/v0/user/" + guid + "/password",
            body: obj,
            corelation: UUIDv4.generate(),
            token: token
        });
    }
}
