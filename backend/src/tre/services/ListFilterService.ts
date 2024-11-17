import express from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { BaseService } from "./BaseService";
import { ListFilterDto } from "common/src/tre/models/ListFilterDto";
import { ListFilterEntity } from "../data/ListFilterEntity";
import { Logger } from "../Logger";
import { ListFilterRepository } from "../data/ListFilterRepository";

export class ListFilterService extends BaseService {
    protected constructDataSource(): EntitiesDataSource {
        return new EntitiesDataSource();
    }

    public constructor(logger: Logger, app: express.Express) {
        super();

        logger.trace();

        app.get("/api/v0/list_filter/:guid", (req, resp) => { this.responseDtoWrapper(req, resp, this.getGuid) });
        app.get("/api/v0/list_filters", (req, resp) => { this.responseDtoWrapper(req, resp, this.getList) });
        app.post("/api/v0/list_filter", (req, resp) => { this.responseDtoWrapper(req, resp, this.postSave) });
        app.delete("/api/v0/list_filter/:guid", (req, resp) => { this.responseDtoWrapper(req, resp, this.deleteGuid) });
        app.get("/api/v0/list/:guid/filters", (req, resp) => { this.responseDtoWrapper(req, resp, this.getListByParentList) });
    }

    public async getGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<ListFilterDto | null> {
        await logger.trace();
        await BaseService.checkSecurityName(logger, "ListFilter:Read", req, ds);

        const guid = req.params["guid"];
        const ret = await new ListFilterRepository(ds).findOneBy({ guid: guid });
        return ret;
    }

    public async getList(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<ListFilterDto[]> {
        await logger.trace();
        await BaseService.checkSecurityName(logger, "ListFilter:List", req, ds);

        const ret = await new ListFilterRepository(ds).find();
        return ret;
    }

    public async getListByParentList(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<ListFilterDto[]> {
        await logger.trace();
        await BaseService.checkSecurityName(logger, "ListFilter:List", req, ds);

        const guid = req.params["guid"];
        const ret = await new ListFilterRepository(ds).find({
            where: { listsGuid: guid },
            order: { listsGuid: "ASC" }
        });
        return ret;
    }

    public async postSave(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurityName(logger, "ListFilter:Save", req, ds);

        const entity = new ListFilterEntity();
        entity.copyFrom(req.body as ListFilterDto);
        await new ListFilterRepository(ds).save([entity]);
    }

    public async deleteGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurityName(logger, "ListFilter:Delete", req, ds);

        const guid = req.params["guid"];
        await new ListFilterRepository(ds).delete({ guid: guid });
    }
}