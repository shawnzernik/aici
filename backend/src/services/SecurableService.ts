import express from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { BaseService } from "./BaseService";
import { SecurableDto } from "common/src/models/SecurableDto";
import { SecurableEntity } from "../data/SecurableEntity";
import { Logger } from "../Logger";

/**
 * Service class for handling securable entities.
 */
export class SecurableService extends BaseService {
    /**
     * Creates an instance of SecurableService.
     * @param logger - The logger instance for logging.
     * @param app - The Express application instance.
     */
    public constructor(logger: Logger, app: express.Express) {
        super();

        logger.trace();

        app.get("/api/v0/securable/:guid", (req, resp) => { this.methodWrapper(req, resp, this.getGuid) });
        app.get("/api/v0/securables", (req, resp) => { this.methodWrapper(req, resp, this.getList) });
        app.post("/api/v0/securable", (req, resp) => { this.methodWrapper(req, resp, this.postSave) });
        app.delete("/api/v0/securable/:guid", (req, resp) => { this.methodWrapper(req, resp, this.deleteGuid) });
    }

    /**
     * Retrieves a securable entity by its GUID.
     * @param logger - The logger instance for logging.
     * @param req - The Express request object.
     * @param ds - The data source instance.
     * @returns The securable entity DTO or null if not found.
     */
    public async getGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<SecurableDto | null> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Securable:Read", req, ds);

        const guid = req.params["guid"];
        const ret = await ds.securableRepository().findOneBy({ guid: guid });
        return ret;
    }

    /**
     * Retrieves a list of all securable entities.
     * @param logger - The logger instance for logging.
     * @param req - The Express request object.
     * @param ds - The data source instance.
     * @returns An array of securable entity DTOs.
     */
    public async getList(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<SecurableDto[]> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Securable:List", req, ds);

        const ret = await ds.securableRepository().find();
        return ret;
    }

    /**
     * Saves a new securable entity.
     * @param logger - The logger instance for logging.
     * @param req - The Express request object.
     * @param ds - The data source instance.
     */
    public async postSave(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Securable:Save", req, ds);

        const entity = new SecurableEntity();
        entity.copyFrom(req.body as SecurableDto);
        await ds.securableRepository().save([entity]);
    }

    /**
     * Deletes a securable entity by its GUID.
     * @param logger - The logger instance for logging.
     * @param req - The Express request object.
     * @param ds - The data source instance.
     */
    public async deleteGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Securable:Delete", req, ds);

        const guid = req.params["guid"];
        await ds.securableRepository().delete({ guid: guid });
    }
}
