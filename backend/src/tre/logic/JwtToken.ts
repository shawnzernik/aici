import * as jwt from "jsonwebtoken";
import { UUIDv4 } from "common/src/tre/logic/UUIDv4";

export class JwtToken implements jwt.JwtPayload {
    public static expiresIn: string = "1h";
    public static audience: string = "lagovistatech.com";
    public static issuer: string = "lagovistatech.com";
    public static subject: string = "jwt_token";
    public static algorithm: "RS512" = "RS512";
    public data: any;

    public constructor(data: any = undefined) {
        this.data = data;
    }

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

    public static verify(token: string, publicKey: string): JwtToken {
        const obj = jwt.verify(token, publicKey);

        const ret = new JwtToken();
        Object.assign(ret, obj);

        return ret;
    }
}