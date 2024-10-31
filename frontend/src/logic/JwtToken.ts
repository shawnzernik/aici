import { jwtVerify, importSPKI } from 'jose';

/**
 * A class representing a JSON Web Token (JWT) utility for verification.
 */
export class JwtToken {
    /**
     * @public
     * The expected audience claim for the JWT.
     */
    public static audience: string = "lagovistatech.com";

    /**
     * @public
     * The expected issuer claim for the JWT.
     */
    public static issuer: string = "lagovistatech.com";

    /**
     * @public
     * The expected subject claim for the JWT.
     */
    public static subject: string = "jwt_token";

    /**
     * @public
     * The expiration time of the JWT in milliseconds.
     */
    public expires: number;

    /**
     * @public
     * The data contained in the JWT.
     */
    public data: any;

    /**
     * Constructs a JwtToken instance.
     * @param data - The data to be associated with the token, default is undefined.
     */
    public constructor(data: any = undefined) {
        this.data = data;
    }

    /**
     * Imports a public key from a PEM formatted string.
     * @private
     * @param pemKey - The PEM formatted public key string.
     * @returns A promise that resolves to a CryptoKey object.
     */
    private static async importPublicKey(pemKey: string): Promise<CryptoKey> {
        return await importSPKI(pemKey, 'RS512');
    }

    /**
     * Verifies a JWT using a public key.
     * @public
     * @param token - The JWT as a string.
     * @param publicKeyPem - The PEM formatted public key string.
     * @returns A promise that resolves to a JwtToken object.
     */
    public static async verify(token: string, publicKeyPem: string): Promise<JwtToken> {
        const publicKey = await JwtToken.importPublicKey(publicKeyPem);

        const { payload } = await jwtVerify(token, publicKey, {
            audience: JwtToken.audience,
            issuer: JwtToken.issuer,
            subject: JwtToken.subject,
        });

        const ret = new JwtToken(payload.data);
        if (payload.exp)
            ret.expires = payload.exp * 1000;
        return ret;
    }
}
