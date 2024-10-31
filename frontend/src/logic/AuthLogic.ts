import { UserDto } from "common/src/models/UserDto";
import { SecurableDto } from "common/src/models/SecurableDto";
import { JwtToken } from "./JwtToken";

/**
 * The AuthLogic class handles the authentication logic,
 * specifically the process of logging in with a token
 * and managing user and securable information.
 */
export class AuthLogic {
    private static invalidTokenMsg = "Invalid token!";

    /** 
     * @public
     * The user object containing information about the authenticated user.
     */
    public user: UserDto | undefined;

    /** 
     * @public
     * An array of securable objects that the user has access to.
     */
    public securables: SecurableDto[] | undefined;

    /** 
     * @private
     * Private constructor to prevent direct instantiation.
     * Use the static method `tokenLogin` to create an instance.
     */
    private constructor() { }

    /**
     * Authenticates a user based on a JWT token and public key.
     * 
     * @param token - The JWT token provided by the user.
     * @param publicKey - The public key used to verify the token.
     * @returns A promise that resolves to an instance of AuthLogic.
     * @throws An error if the token is invalid or if the payload does not contain the required data.
     */
    public static async tokenLogin(token: string, publicKey: string): Promise<AuthLogic> {
        let payload = null;
        try {
            payload = await JwtToken.verify(token, publicKey); // Await the async function 
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
