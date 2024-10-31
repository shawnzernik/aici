import * as jwt from "jsonwebtoken";
import { UUIDv4 } from "common/src/logic/UUIDv4";

/**
 * Represents a JSON Web Token (JWT) with signing and verification capabilities.
 */
export class JwtToken implements jwt.JwtPayload {
    /**
     * The duration before the token expires.
     */
    public static expiresIn: string = "1h";

    /**
     * The intended audience of the token.
     */
    public static audience: string = "lagovistatech.com";

    /**
     * The issuer of the token.
     */
    public static issuer: string = "lagovistatech.com";

    /**
     * The subject of the token.
     */
    public static subject: string = "jwt_token";

    /**
     * The algorithm used to sign the token.
     */
    public static algorithm: "RS512" = "RS512";

    /**
     * The payload data of the token.
     */
    public data: any;

    /**
     * Creates a new instance of JwtToken.
     * @param data The payload data to include in the token. Defaults to undefined.
     */
    public constructor(data: any = undefined) {
        this.data = data;
    }

    /**
     * Signs the token using the provided private key.
     * @param privateKey The private key used to sign the token.
     * @returns The signed JWT as a string.
     */
    public sign(privateKey: string): string {
        return jwt.sign({ data: this.data }, privateKey, {
            expiresIn: JwtToken.expiresIn,
            audience: JwtToken.audience,
            issuer: JwtToken.issuer,
            subject: JwtToken.subject,
            algorithm: JwtToken.algorithm,
            jwtid: UUIDv4.generate()
        });
    }

    /**
     * Verifies a JWT using the provided public key and returns a JwtToken instance.
     * @param token The JWT string to verify.
     * @param publicKey The public key used to verify the token.
     * @returns An instance of JwtToken if verification is successful.
     * @throws Will throw an error if the token is invalid or verification fails.
     */
    public static verify(token: string, publicKey: string): JwtToken {
        const obj = jwt.verify(token, publicKey);

        const ret = new JwtToken();
        Object.assign(ret, obj);

        return ret;
    }
}
