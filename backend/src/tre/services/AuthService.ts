import fs from "fs";
import express from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { BaseService } from "./BaseService";
import { AuthLogic } from "../logic/AuthLogic";
import { Config } from "../../Config";
import { UserDto } from "common/src/tre/models/UserDto";
import { UserEntity } from "../data/UserEntity";
import { PasswordLogic } from "../logic/PasswordLogic";
import { Logger } from "../Logger";
import { UserRepository } from "../data/UserRepository";
import { PasswordRepository } from "../data/PasswordRepository";

/**
 * Service for handling authentication related operations.
 */
export class AuthService extends BaseService {
    protected constructDataSource(): EntitiesDataSource {
        return new EntitiesDataSource();
    }

    /**
     * Creates an instance of AuthService.
     * @param logger - Logger instance for logging purposes.
     * @param app - Express application instance.
     */
    public constructor(logger: Logger, app: express.Express) {
        super();

        logger.trace();

        app.post("/api/v0/auth/login", (req, resp) => { this.methodWrapper(req, resp, this.postLogin) });
        app.get("/api/v0/auth/renew", (req, resp) => { this.methodWrapper(req, resp, this.postRenew) });
        app.get("/api/v0/auth/public_key", (req, resp) => { this.methodWrapper(req, resp, this.getPublicKey) });
        app.get("/api/v0/auth/anonymous", (req, resp) => { this.methodWrapper(req, resp, this.getAnonymous) });
        app.get("/api/v0/auth/user", (req, resp) => { this.methodWrapper(req, resp, this.getUser) });
        app.post("/api/v0/auth/user", (req, resp) => { this.methodWrapper(req, resp, this.postUser) });
        app.post("/api/v0/auth/password", (req, resp) => { this.methodWrapper(req, resp, this.postPassword) });
    }

    /**
     * Retrieves user information.
     * @param logger - Logger instance for logging purposes.
     * @param req - Express request object.
     * @param ds - Data source for accessing entities.
     * @returns Promise resolving to the UserDto object.
     */
    public async getUser(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<UserDto> {
        await logger.trace();
        const logic = await BaseService.checkSecurity(logger, "Auth:Get:User", req, ds);

        const ret = await new UserRepository(ds).findOneBy({ guid: logic.user!.guid });
        if (!ret)
            throw new Error("Could not locate user for token!");

        return ret;
    }

    /**
     * Updates user information.
     * @param logger - Logger instance for logging purposes.
     * @param req - Express request object containing user data.
     * @param ds - Data source for accessing entities.
     * @returns Promise resolving to void.
     */
    public async postUser(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Auth:Post:User", req, ds);

        const logic = await BaseService.checkSecurity(logger, "Auth:Get:User", req, ds);

        const entity = new UserEntity();
        entity.copyFrom(req.body as UserDto);

        if (entity.guid != logic.user!.guid)
            throw new Error("User being saved is not the active user!");

        await new UserRepository(ds).save([entity]);
    }

    /**
     * Updates the password for the user.
     * @param logger - Logger instance for logging purposes.
     * @param req - Express request object containing password data.
     * @param ds - Data source for accessing entities.
     * @returns Promise resolving to void.
     */
    public async postPassword(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Auth:Post:Password", req, ds);

        const logic = await BaseService.checkSecurity(logger, "Auth:Get:User", req, ds);
        const login = await AuthLogic.passwordLogin(ds, logic.user!.emailAddress, req.body["currentPassword"]);
        const passLogic = new PasswordLogic();
        const passEntity = await passLogic.reset(ds, login.user!.guid, req.body["newPassword"], req.body["confirmPassword"]);

        await new PasswordRepository(ds).save([passEntity]);
    }

    /**
     * Authenticates a user and generates a login token.
     * @param logger - Logger instance for logging purposes.
     * @param req - Express request object containing login credentials.
     * @param ds - Data source for accessing entities.
     * @returns Promise resolving to the generated token.
     */
    public async postLogin(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<string> {
        await logger.trace();

        const bodyJson = req.body;
        const auth = await AuthLogic.passwordLogin(ds, bodyJson["emailAddress"], bodyJson["password"]);
        return auth.tokenize();
    }

    /**
     * Retrieves the public key for JWT verification.
     * @param logger - Logger instance for logging purposes.
     * @param req - Express request object.
     * @param ds - Data source for accessing entities.
     * @returns Promise resolving to the public key string.
     */
    public async getPublicKey(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<string> {
        await logger.trace();

        const content = fs.readFileSync(Config.jwtPublicKeyFile, { encoding: "utf8" });
        return content;
    }

    /**
     * Authenticates an anonymous user and generates a token.
     * @param logger - Logger instance for logging purposes.
     * @param req - Express request object.
     * @param ds - Data source for accessing entities.
     * @returns Promise resolving to the generated token.
     */
    public async getAnonymous(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<string> {
        await logger.trace();

        const auth = await AuthLogic.anonymousLogin(ds);
        return auth.tokenize();
    }

    /**
     * Renews the user's token based on the provided authorization header.
     * @param logger - Logger instance for logging purposes.
     * @param req - Express request object containing the authorization header.
     * @param ds - Data source for accessing entities.
     * @returns Promise resolving to the new token.
     */
    public async postRenew(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<string> {
        await logger.trace();

        const authHeader = req.headers["authorization"];
        const authToken = authHeader && authHeader.split(" ")[1];
        if (!authToken)
            throw new Error("You must provide an Authorization header with the value of 'Bearer JWTTOKEN'!");

        const auth = await AuthLogic.tokenLogin(authToken);
        return auth.tokenize();
    }
}
