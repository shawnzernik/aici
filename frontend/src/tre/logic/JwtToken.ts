import { jwtVerify, importSPKI } from "jose";

export class JwtToken {
    public static audience: string = "lagovistatech.com";

    public static issuer: string = "lagovistatech.com";

    public static subject: string = "jwt_token";

    public expires: number;

    public data: any;

    public constructor(data: any = undefined) {
        this.data = data;
    }

    private static async importPublicKey(pemKey: string): Promise<CryptoKey> {
        return await importSPKI(pemKey, "RS512");
    }

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