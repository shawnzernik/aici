import express from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { BaseService } from "./BaseService";
import { UserDto } from "common/src/models/UserDto";
import { UserEntity } from "../data/UserEntity";
import { PasswordLogic } from "../logic/PasswordLogic";
import { Logger } from "../Logger";

/**
 * UserService class handles user-related operations
 * and defines API endpoints for user management.
 */
export class UserService extends BaseService {
    /**
     * Creates an instance of UserService.
     * @param logger - Logger instance for logging.
     * @param app - Express application instance.
     */
    public constructor(logger: Logger, app: express.Express) {
        super();

        logger.trace();

        app.get("/api/v0/user/:guid", (req, resp) => { this.methodWrapper(req, resp, this.getGuid) });
        app.get("/api/v0/users", (req, resp) => { this.methodWrapper(req, resp, this.getList) });
        app.post("/api/v0/user", (req, resp) => { this.methodWrapper(req, resp, this.postSave) });
        app.delete("/api/v0/user/:guid", (req, resp) => { this.methodWrapper(req, resp, this.deleteGuid) });
        app.post("/api/v0/user/:guid/password", (req, resp) => { this.methodWrapper(req, resp, this.postPassword) });
    }

    /**
     * Retrieves a user by GUID.
     * @param logger - Logger instance for logging.
     * @param req - Express request object.
     * @param ds - EntitiesDataSource instance for data access.
     * @returns UserDto or null if not found.
     */
    public async getGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<UserDto | null> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "User:Read", req, ds);

        const guid = req.params["guid"];
        const ret = await ds.userRepository().findOneBy({ guid: guid });
        return ret;
    }

    /**
     * Retrieves a list of users.
     * @param logger - Logger instance for logging.
     * @param req - Express request object.
     * @param ds - EntitiesDataSource instance for data access.
     * @returns Array of UserDto
     */
    public async getList(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<UserDto[]> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "User:List", req, ds);

        const ret = await ds.userRepository().find();
        return ret;
    }

    /**
     * Saves a new user.
     * @param logger - Logger instance for logging.
     * @param req - Express request object.
     * @param ds - EntitiesDataSource instance for data access.
     */
    public async postSave(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "User:Save", req, ds);

        const entity = new UserEntity();
        entity.copyFrom(req.body as UserDto);
        await ds.userRepository().save([entity]);
    }

    /**
     * Deletes a user by GUID.
     * @param logger - Logger instance for logging.
     * @param req - Express request object.
     * @param ds - EntitiesDataSource instance for data access.
     */
    public async deleteGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "User:Delete", req, ds);

        const guid = req.params["guid"];
        await ds.userRepository().delete({ guid: guid });
    }

    /**
     * Resets a user's password.
     * @param logger - Logger instance for logging.
     * @param req - Express request object.
     * @param ds - EntitiesDataSource instance for data access.
     */
    public async postPassword(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "User:Password", req, ds);

        const guid = req.params["guid"];

        const passLogic = new PasswordLogic();
        const passEntity = await passLogic.reset(ds, guid, req.body["password"], req.body["confirm"]);
        await ds.passwordRepository().save(passEntity);
    }
}
