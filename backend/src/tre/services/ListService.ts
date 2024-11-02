import express from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { BaseService } from "./BaseService";
import { ListDto } from "common/src/tre/models/ListDto";
import { ListEntity } from "../data/ListEntity";
import { ListLogic } from "../logic/ListLogic";
import { ListFilterDto } from "common/src/tre/models/ListFilterDto";
import { Logger } from "../Logger";
import { ListRepository } from "../data/ListRepository";

/**
 * Service for managing lists.
 */
export class ListService extends BaseService {
    protected constructDataSource(): EntitiesDataSource {
        return new EntitiesDataSource();
    }

    /**
     * Creates an instance of ListService.
     * @param logger - Logger instance for logging.
     * @param app - Express application instance to register routes.
     */
    public constructor(logger: Logger, app: express.Express) {
        super();

        logger.trace();

        app.post("/api/v0/list/:guid/items", (req, resp) => { this.methodWrapper(req, resp, this.postItems) });
        app.get("/api/v0/list/:guid", (req, resp) => { this.methodWrapper(req, resp, this.getGuid) });
        app.get("/api/v0/list/url_key/:url_key", (req, resp) => { this.methodWrapper(req, resp, this.getUrlKey) });
        app.get("/api/v0/lists", (req, resp) => { this.methodWrapper(req, resp, this.getList) });
        app.post("/api/v0/list", (req, resp) => { this.methodWrapper(req, resp, this.postSave) });
        app.delete("/api/v0/list/:guid", (req, resp) => { this.methodWrapper(req, resp, this.deleteGuid) });
    }

    /**
     * Posts items to a specific list.
     * @param logger - Logger instance for logging.
     * @param req - Express request object.
     * @param ds - Data source context.
     * @returns A promise that resolves to an array of ListDto.
     */
    public async postItems(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<ListDto[]> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "List:Items", req, ds);

        const guid = req.params["guid"];
        const listDto = await new ListRepository(ds).findOneBy({ guid: guid });
        if (!listDto)
            throw new Error(`Could not locate list GUID ${guid}!`);

        const filters = req.body as ListFilterDto[];

        const listLogic = new ListLogic(listDto);
        const ret = await listLogic.getItems(ds, filters);

        return ret;
    }

    /**
     * Gets a specific list by GUID.
     * @param logger - Logger instance for logging.
     * @param req - Express request object.
     * @param ds - Data source context.
     * @returns A promise that resolves to a ListDto or null.
     */
    public async getGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<ListDto | null> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "List:Read", req, ds);

        const guid = req.params["guid"];
        const ret = await new ListRepository(ds).findOneBy({ guid: guid });
        return ret;
    }

    /**
     * Gets a specific list by URL key.
     * @param logger - Logger instance for logging.
     * @param req - Express request object.
     * @param ds - Data source context.
     * @returns A promise that resolves to a ListDto or null.
     */
    public async getUrlKey(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<ListDto | null> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "List:Read", req, ds);

        const urlKey = req.params["url_key"];
        const ret = await new ListRepository(ds).findOneBy({ urlKey: urlKey });
        return ret;
    }

    /**
     * Gets all lists.
     * @param logger - Logger instance for logging.
     * @param req - Express request object.
     * @param ds - Data source context.
     * @returns A promise that resolves to an array of ListDto.
     */
    public async getList(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<ListDto[]> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "List:List", req, ds);

        const ret = await new ListRepository(ds).find();
        return ret;
    }

    /**
     * Saves a new list.
     * @param logger - Logger instance for logging.
     * @param req - Express request object.
     * @param ds - Data source context.
     * @returns A promise that resolves to void.
     */
    public async postSave(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "List:Save", req, ds);

        const entity = new ListEntity();
        entity.copyFrom(req.body as ListDto);
        await new ListRepository(ds).save([entity]);
    }

    /**
     * Deletes a specific list by GUID.
     * @param logger - Logger instance for logging.
     * @param req - Express request object.
     * @param ds - Data source context.
     * @returns A promise that resolves to void.
     */
    public async deleteGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "List:Delete", req, ds);

        const guid = req.params["guid"];
        await new ListRepository(ds).delete({ guid: guid });
    }
}
