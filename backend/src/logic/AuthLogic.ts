import fs from "fs";
import { UserDto } from "common/src/models/UserDto";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { PasswordEntity } from "../data/PasswordEntity";
import { PasswordLogic } from "./PasswordLogic";
import { Config } from "../Config";
import { SecurableDto } from "common/src/models/SecurableDto";
import { UserEntity } from "../data/UserEntity";
import { JwtToken } from "./JwtToken";

/**
 * Handles authentication logic, including user login and token management.
 */
export class AuthLogic {
    /**
     * Message displayed when a login attempt is invalid.
     */
    private static invalidLoginMsg: string = "Invalid login!";

    /**
     * Message displayed when a token is invalid.
     */
    private static invalidTokenMsg: string = "Invalid token!";

    /**
     * The authenticated user's data transfer object.
     */
    public user: UserDto | undefined;

    /**
     * The list of securable permissions associated with the user.
     */
    public securables: SecurableDto[] | undefined;

    /**
     * Private constructor to prevent direct instantiation.
     */
    private constructor() { }

    /**
     * Generates a JWT token for the authenticated user.
     * @returns The signed JWT token as a string.
     */
    public tokenize(): string {
        const key = fs.readFileSync(Config.jwtPrivateKeyFile, { encoding: "utf8" });
        const token = new JwtToken(this);
        const ret = token.sign(key);
        return ret;
    }

    /**
     * Performs an anonymous login using the predefined anonymous user.
     * @param eds The data source for accessing repositories.
     * @returns A promise that resolves to an instance of AuthLogic upon successful login.
     * @throws Will throw an error if the anonymous user is not found.
     */
    public static async anonymousLogin(eds: EntitiesDataSource): Promise<AuthLogic> {
        const user = await eds.userRepository().findOneBy({ emailAddress: "anonymous@localhost" });
        if (!user)
            throw new Error(AuthLogic.invalidLoginMsg);

        let ret = await AuthLogic.createLogic(eds, user);
        return ret;
    }

    /**
     * Performs a login using email and password credentials.
     * @param eds The data source for accessing repositories.
     * @param email The user's email address.
     * @param password The user's password.
     * @returns A promise that resolves to an instance of AuthLogic upon successful login.
     * @throws Will throw an error if the login credentials are invalid.
     */
    public static async passwordLogin(eds: EntitiesDataSource, email: string, password: string): Promise<AuthLogic> {
        const user = await eds.userRepository().findOneBy({ emailAddress: email });
        if (!user)
            throw new Error(AuthLogic.invalidLoginMsg);

        const passwords = await eds.passwordRepository().findBy({ usersGuid: user.guid });
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

    /**
     * Creates an instance of AuthLogic with the provided user and loads their securables.
     * @param eds The data source for accessing repositories.
     * @param user The user entity to create the AuthLogic instance for.
     * @returns A promise that resolves to an instance of AuthLogic.
     */
    private static async createLogic(eds: EntitiesDataSource, user: UserEntity): Promise<AuthLogic> {
        const ret = new AuthLogic();
        ret.user = user;
        ret.securables = await AuthLogic.loadAllowedSecurablesForUser(eds, user);
        return ret;
    }

    /**
     * Performs a login using a JWT token.
     * @param token The JWT token to validate and extract user information from.
     * @returns A promise that resolves to an instance of AuthLogic upon successful token validation.
     * @throws Will throw an error if the token is invalid or improperly formatted.
     */
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

    /**
     * Loads the securable permissions allowed for a specific user.
     * @param eds The data source for accessing repositories.
     * @param user The user DTO containing user information.
     * @returns A promise that resolves to an array of securable DTOs.
     */
    private static async loadAllowedSecurablesForUser(eds: EntitiesDataSource, user: UserDto): Promise<SecurableDto[]> {
        const ret = await eds.securableRepository()
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
