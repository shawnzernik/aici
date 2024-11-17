import express from "express";
import { DatasetEntity } from "../data/DatasetEntity";
import { Logger } from "../../tre/Logger";
import { DatasetDto } from "common/src/app/models/DatasetDto";
import { EntitiesDataSource } from "../../app/data/EntitiesDataSource";
import { BaseService } from "../../tre/services/BaseService";
import { DatasetRepository } from "../data/DatasetRepository";

export class DatasetService extends BaseService {
    protected constructDataSource(): EntitiesDataSource {
        return new EntitiesDataSource();
    }

    public constructor(logger: Logger, app: express.Express) {
        super();

        logger.trace();

        app.get("/api/v0/dataset/:guid", (req, resp) => { this.responseDtoWrapper(req, resp, this.getGuid) });
        app.get("/api/v0/datasets", (req, resp) => { this.responseDtoWrapper(req, resp, this.getList) });
        app.post("/api/v0/dataset", (req, resp) => { this.responseDtoWrapper(req, resp, this.postSave) });
        app.delete("/api/v0/dataset/:guid", (req, resp) => { this.responseDtoWrapper(req, resp, this.deleteGuid) });
    }

    public async getGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<DatasetDto | null> {
        await logger.trace();
        await BaseService.checkSecurityName(logger, "Dataset:Read", req, ds);

        const guid = req.params["guid"];
        const ret = await new DatasetRepository(ds).findOneBy({ guid: guid });
        return ret;
    }

    public async getList(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<DatasetDto[]> {
        await logger.trace();
        await BaseService.checkSecurityName(logger, "Dataset:List", req, ds);

        const ret = await new DatasetRepository(ds).find();
        return ret;
    }

    public async postSave(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurityName(logger, "Dataset:Save", req, ds);

        const entity = new DatasetEntity();
        entity.copyFrom(req.body as DatasetDto);
        await new DatasetRepository(ds).save([entity]);
    }

    public async deleteGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurityName(logger, "Dataset:Delete", req, ds);

        const guid = req.params["guid"];
        await new DatasetRepository(ds).delete({ guid: guid });
    }
}