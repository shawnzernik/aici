import express from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { BaseService } from "./BaseService";
import { MenuDto } from "common/src/tre/models/MenuDto";
import { MenuEntity } from "../data/MenuEntity";
import { Logger } from "../Logger";
import { MenuRepository } from "../data/MenuRepository";

/**
 * Service for managing menus.
 */
export class MenuService extends BaseService {
    protected constructDataSource(): EntitiesDataSource {
        return new EntitiesDataSource();
    }

    /**
     * Constructor for MenuService.
     * @param logger - Logger instance for logging.
     * @param app - Express application instance to register routes.
     */
    public constructor(logger: Logger, app: express.Express) {
        super();

        logger.trace();

        app.get("/api/v0/menu/:guid", (req, resp) => { this.methodWrapper(req, resp, this.getGuid) });
        app.get("/api/v0/menus", (req, resp) => { this.methodWrapper(req, resp, this.getList) });
        app.post("/api/v0/menu", (req, resp) => { this.methodWrapper(req, resp, this.postSave) });
        app.delete("/api/v0/menu/:guid", (req, resp) => { this.methodWrapper(req, resp, this.deleteGuid) });
    }

    /**
     * Retrieves a menu by its GUID.
     * @param logger - Logger instance for logging.
     * @param req - Express request object.
     * @param ds - Data source instance for database operations.
     * @returns MenuDto object or null if not found.
     */
    public async getGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<MenuDto | null> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Menu:Read", req, ds);

        const guid = req.params["guid"];
        const ret = await new MenuRepository(ds).findOneBy({ guid: guid });
        return ret;
    }
    /**
     * Retrieves a list of menus.
     * @param logger - Logger instance for logging.
     * @param req - Express request object.
     * @param ds - Data source instance for database operations.
     * @returns Array of MenuDto objects.
     */
    public async getList(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<MenuDto[]> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Menu:List", req, ds);

        const ret = await new MenuRepository(ds).find();
        return ret;
    }
    /**
     * Saves a new menu.
     * @param logger - Logger instance for logging.
     * @param req - Express request object.
     * @param ds - Data source instance for database operations.
     */
    public async postSave(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Menu:Save", req, ds);

        const entity = new MenuEntity();
        entity.copyFrom(req.body as MenuDto);
        await new MenuRepository(ds).save([entity]);
    }
    /**
     * Deletes a menu by its GUID.
     * @param logger - Logger instance for logging.
     * @param req - Express request object.
     * @param ds - Data source instance for database operations.
     */
    public async deleteGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Menu:Delete", req, ds);

        const guid = req.params["guid"];
        const results = await new MenuRepository(ds).delete({ guid: guid });
        if (results.affected != 1)
            throw Error(`Affected rows = ${results.affected}!`);
    }
}
