import express from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { BaseService } from "./BaseService";
import { PasswordDto } from "common/src/models/PasswordDto";
import { PasswordEntity } from "../data/PasswordEntity";
import { Logger } from "../Logger";

/**
 * Service class for handling password-related operations.
 */
export class PasswordService extends BaseService {
    /**
     * Constructor for the PasswordService class.
     * @param logger - Logger instance for logging.
     * @param app - Express application instance.
     */
    public constructor(logger: Logger, app: express.Express) {
        super();

        logger.trace();

        app.get("/api/v0/password/:guid", (req, resp) => { this.methodWrapper(req, resp, this.getGuid) });
        app.get("/api/v0/passwords", (req, resp) => { this.methodWrapper(req, resp, this.getList) });
        app.post("/api/v0/password", (req, resp) => { this.methodWrapper(req, resp, this.postSave) });
        app.delete("/api/v0/password/:guid", (req, resp) => { this.methodWrapper(req, resp, this.deleteGuid) });
    }

    /**
     * Retrieves a password entry by its GUID.
     * @param logger - Logger instance for logging.
     * @param req - Express request object.
     * @param ds - Data source instance.
     * @returns Promise resolving to a PasswordDto object or null if not found.
     */
    public async getGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<PasswordDto | null> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Password:Read", req, ds);

        const guid = req.params["guid"];
        const ret = await ds.passwordRepository().findOneBy({ guid: guid });
        return ret;
    }

    /**
     * Retrieves a list of all password entries.
     * @param logger - Logger instance for logging.
     * @param req - Express request object.
     * @param ds - Data source instance.
     * @returns Promise resolving to an array of PasswordDto objects.
     */
    public async getList(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<PasswordDto[]> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Password:List", req, ds);

        const ret = await ds.passwordRepository().find();
        return ret;
    }

    /**
     * Saves a new password entry.
     * @param logger - Logger instance for logging.
     * @param req - Express request object.
     * @param ds - Data source instance.
     * @returns Promise resolving to void.
     */
    public async postSave(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Password:Save", req, ds);

        const entity = new PasswordEntity();
        entity.copyFrom(req.body as PasswordDto);
        await ds.passwordRepository().save([entity]);
    }

    /**
     * Deletes a password entry by its GUID.
     * @param logger - Logger instance for logging.
     * @param req - Express request object.
     * @param ds - Data source instance.
     * @returns Promise resolving to void.
     */
    public async deleteGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Password:Delete", req, ds);

        const guid = req.params["guid"];
        await ds.passwordRepository().delete({ guid: guid });
    }
}
