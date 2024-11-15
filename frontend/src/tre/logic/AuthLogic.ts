import { UserDto } from "common/src/tre/models/UserDto";
import { SecurableDto } from "common/src/tre/models/SecurableDto";
import { JwtToken } from "./JwtToken";

export class AuthLogic {
    private static invalidTokenMsg = "Invalid token!";

    public user: UserDto | undefined;

    public securables: SecurableDto[] | undefined;

    private constructor() { }

    public static async tokenLogin(token: string, publicKey: string): Promise<AuthLogic> {
        let payload = null;
        try {
            payload = await JwtToken.verify(token, publicKey); 
        } catch (err) {
            throw new Error(AuthLogic.invalidTokenMsg);
        }

        if (!payload || !payload.data || !payload.data["user"] || !payload.data["securables"])
            throw new Error(AuthLogic.invalidTokenMsg);

        const ret = new AuthLogic();
        ret.user = payload.data["user"] as UserDto;
        ret.securables = payload.data["securables"] as SecurableDto[];
        return ret;
    }
}
