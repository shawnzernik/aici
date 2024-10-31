import { LoginDto } from "common/src/models/LoginDto";
import { FetchWrapper } from "./FetchWrapper";
import { JwtToken } from "../logic/JwtToken";
import { UserDto } from "common/src/models/UserDto";
import { UUIDv4 } from "common/src/logic/UUIDv4";

/**
 * Service class for handling authentication-related operations.
 */
export class AuthService {
    // Static property to hold the public key.
    private static myPublicKey: string;

    /**
     * Retrieves the public key used for verifying tokens.
     * @returns A promise that resolves to the public key string.
     */
    public static async publicKey(): Promise<string> {
        if (AuthService.myPublicKey)
            return AuthService.myPublicKey;

        const ret = await FetchWrapper.get<string>({
            url: "/api/v0/auth/public_key",
            corelation: UUIDv4.generate()
        });
        AuthService.myPublicKey = ret;
        return ret;
    }

    /**
     * Authenticates an anonymous user.
     * @returns A promise that resolves to the token string.
     */
    public static async anonymous(): Promise<string> {
        const ret = await FetchWrapper.get<string>({
            url: "/api/v0/auth/anonymous",
            corelation: UUIDv4.generate()
        });

        const key = await AuthService.publicKey();
        JwtToken.verify(ret, key);

        return ret;
    }

    /**
     * Logs in a user with the provided credentials.
     * @param emailAddress - The email address of the user.
     * @param password - The password of the user.
     * @returns A promise that resolves to the token string.
     */
    public static async login(emailAddress: string, password: string): Promise<string> {
        const login: LoginDto = {
            emailAddress: emailAddress,
            password: password
        };

        const ret = await FetchWrapper.post<string>({
            url: "/api/v0/auth/login",
            body: login,
            corelation: UUIDv4.generate()
        });

        const key = await AuthService.publicKey();
        JwtToken.verify(ret, key);

        return ret;
    }

    /**
     * Retrieves the user information associated with the token.
     * @returns A promise that resolves to a UserDto object.
     */
    public static async getUser(): Promise<UserDto> {
        const token = await this.getToken();
        const ret = await FetchWrapper.get<UserDto>({
            url: "/api/v0/auth/user",
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    /**
     * Updates the user information.
     * @param user - The UserDto object containing updated information.
     * @returns A promise that resolves when the operation is complete.
     */
    public static async postUser(user: UserDto): Promise<void> {
        const token = await this.getToken();
        const ret = await FetchWrapper.post({
            url: "/api/v0/auth/user",
            body: user,
            corelation: UUIDv4.generate(),
            token: token
        });
    }

    /**
     * Updates the user's password.
     * @param current - The current password.
     * @param newPass - The new password.
     * @param confirm - The confirmation of the new password.
     * @returns A promise that resolves when the operation is complete.
     */
    public static async postPassword(current: string, newPass: string, confirm: string): Promise<void> {
        const obj = {
            currentPassword: current, newPassword: newPass, confirmPassword: confirm
        };
        const token = await this.getToken();
        await FetchWrapper.post({
            url: "/api/v0/auth/password",
            body: obj,
            corelation: UUIDv4.generate(),
            token: token
        });
    }

    /**
     * Renews a token.
     * @param token - The token to renew.
     * @returns A promise that resolves to the new token string.
     */
    public static async renew(token: string): Promise<string> {
        const ret = await FetchWrapper.get<string>({
            url: "/api/v0/auth/renew",
            corelation: UUIDv4.generate(),
            token: token
        });

        const key = await AuthService.publicKey();
        JwtToken.verify(ret, key);

        return ret;
    }

    /**
     * Sets the token in local storage.
     * @param value - The token string to set.
     */
    public static setToken(value: string): void {
        window.localStorage.setItem("AuthService.token", value);
    }

    /**
     * Gets the token from local storage and verifies it.
     * @returns A promise that resolves to the valid token string.
     */
    public static async getToken(): Promise<string> {
        const token = window.localStorage.getItem("AuthService.token");
        if (!token)
            return token;

        const key = await AuthService.publicKey();
        let jwt;
        try { jwt = await JwtToken.verify(token, key); }
        catch (err) { window.location.assign("/"); }

        const now = Date.now();
        const expiresMinutesLeft = (jwt.expires - now) / 1000 / 60;
        if (expiresMinutesLeft > 2)
            return token;
        if (expiresMinutesLeft < 0)
            throw new Error("Token has expired! Please log in again.");

        const newToken = await AuthService.renew(token);
        AuthService.setToken(newToken);
        return newToken;
    }
}
