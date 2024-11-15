import fs from "fs";
import { UserDto } from "common/src/tre/models/UserDto";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { PasswordEntity } from "../data/PasswordEntity";
import { PasswordLogic } from "./PasswordLogic";
import { Config } from "../../Config";
import { SecurableDto } from "common/src/tre/models/SecurableDto";
import { UserEntity } from "../data/UserEntity";
import { JwtToken } from "./JwtToken";
import { PasswordRepository } from "../data/PasswordRepository";
import { SecurableRepository } from "../data/SecurableRepository";
import { UserRepository } from "../data/UserRepository";

export class AuthLogic {
    private static invalidLoginMsg: string = "Invalid login!";
    private static invalidTokenMsg: string = "Invalid token!";
    public user: UserDto | undefined;
    public securables: SecurableDto[] | undefined;

    private constructor() { }

    public tokenize(): string {
        const key = fs.readFileSync(Config.jwtPrivateKeyFile, { encoding: "utf8" });
        const token = new JwtToken(this);
        const ret = token.sign(key);
        return ret;
    }

    public static async anonymousLogin(eds: EntitiesDataSource): Promise<AuthLogic> {
        const user = await new UserRepository(eds).findOneBy({ emailAddress: "anonymous@localhost" });
        if (!user)
            throw new Error(AuthLogic.invalidLoginMsg);

        let ret = await AuthLogic.createLogic(eds, user);
        return ret;
    }

    public static async passwordLogin(eds: EntitiesDataSource, email: string, password: string): Promise<AuthLogic> {
        const user = await new UserRepository(eds).findOneBy({ emailAddress: email });
        if (!user)
            throw new Error(AuthLogic.invalidLoginMsg);

        const passwords = await new PasswordRepository(eds).findBy({ usersGuid: user.guid });
        if (!passwords || passwords.length < 1)
            throw new Error(AuthLogic.invalidLoginMsg);

        passwords.sort(PasswordLogic.compareCreatedDesc);

        const rehashedPassword = new PasswordEntity();
        rehashedPassword.iterations = passwords[0].iterations;
        rehashedPassword.salt = passwords[0].salt;

        const passLogic = new PasswordLogic(rehashedPassword);
        passLogic.computeHash(password);

        if (passwords[0].hash !== rehashedPassword.hash)
            throw new Error(AuthLogic.invalidLoginMsg);

        let ret = await AuthLogic.createLogic(eds, user);
        return ret;
    }

    private static async createLogic(eds: EntitiesDataSource, user: UserEntity): Promise<AuthLogic> {
        const ret = new AuthLogic();
        ret.user = user;
        ret.securables = await AuthLogic.loadAllowedSecurablesForUser(eds, user);
        return ret;
    }

    public static async tokenLogin(token: string): Promise<AuthLogic> {
        const key = fs.readFileSync(Config.jwtPrivateKeyFile, { encoding: "utf8" });
        let payload = null;
        try { payload = JwtToken.verify(token, key); }
        catch (err) {
            throw new Error(AuthLogic.invalidTokenMsg);
        }

        if (!payload || !payload.data || !payload.data["user"] || !payload.data["securables"])
            throw new Error(AuthLogic.invalidTokenMsg);

        const ret = new AuthLogic();
        ret.user = payload.data["user"] as UserDto;
        ret.securables = payload.data["securables"] as SecurableDto[];
        return ret;
    }

    private static async loadAllowedSecurablesForUser(eds: EntitiesDataSource, user: UserDto): Promise<SecurableDto[]> {
        const ret = await new SecurableRepository(eds)
            .createQueryBuilder("s")
            .where(`s.guid IN (
                SELECT
                    p.securables_guid
                FROM
                    "users" u
                    JOIN memberships m ON m.users_guid = u.guid AND m.is_included = TRUE
                    JOIN permissions p ON p.groups_guid = m.groups_guid AND p.is_allowed = TRUE
                WHERE
                    u.guid = :guid
                GROUP BY p.securables_guid
            )`, { guid: user.guid })
            .orderBy("s.display_name", "ASC")
            .getMany();

        return ret || [];
    }
}