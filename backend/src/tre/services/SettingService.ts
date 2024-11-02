import express from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { BaseService } from "./BaseService";
import { SettingDto } from "common/src/tre/models/SettingDto";
import { SettingEntity } from "../data/SettingEntity";
import { Logger } from "../Logger";
import { SettingRepository } from "../data/SettingRepository";

/**
 * Service class for handling settings-related operations.
 */
export class SettingService extends BaseService {
    protected constructDataSource(): EntitiesDataSource {
        return new EntitiesDataSource();
    }

    /**
     * Constructor for SettingService.
     * @param logger - Logger instance for logging.
     * @param app - Express application instance for routing.
     */
    public constructor(logger: Logger, app: express.Express) {
        super();

        logger.trace();

        app.get("/api/v0/setting/:guid", (req, resp) => { this.methodWrapper(req, resp, this.getGuid) });
        app.get("/api/v0/settings", (req, resp) => { this.methodWrapper(req, resp, this.getList) });
        app.post("/api/v0/setting", (req, resp) => { this.methodWrapper(req, resp, this.postSave) });
        app.delete("/api/v0/setting/:guid", (req, resp) => { this.methodWrapper(req, resp, this.deleteGuid) });
    }

    /**
     * Retrieves a setting by its GUID.
     * @param logger - Logger instance for logging.
     * @param req - Express request object.
     * @param ds - Data source instance for database operations.
     * @returns SettingDto object or null if not found.
     */
    public async getGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<SettingDto | null> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Setting:Read", req, ds);

        const guid = req.params["guid"];
        const ret = await new SettingRepository(ds).findOneBy({ guid: guid });
        return ret;
    }

    /**
     * Retrieves a list of settings.
     * @param logger - Logger instance for logging.
     * @param req - Express request object.
     * @param ds - Data source instance for database operations.
     * @returns Array of SettingDto objects.
     */
    public async getList(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<SettingDto[]> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Setting:List", req, ds);

        const ret = await new SettingRepository(ds).find();
        return ret;
    }

    /**
     * Saves a new setting.
     * @param logger - Logger instance for logging.
     * @param req - Express request object.
     * @param ds - Data source instance for database operations.
     * @returns Void.
     */
    public async postSave(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Setting:Save", req, ds);

        const entity = new SettingEntity();
        entity.copyFrom(req.body as SettingDto);
        await new SettingRepository(ds).save([entity]);
    }

    /**
     * Deletes a setting by its GUID.
     * @param logger - Logger instance for logging.
     * @param req - Express request object.
     * @param ds - Data source instance for database operations.
     * @returns Void.
     */
    public async deleteGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Setting:Delete", req, ds);

        const guid = req.params["guid"];
        await new SettingRepository(ds).delete({ guid: guid });
    }
}
