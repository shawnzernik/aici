import express from "express";
import { FinetuneEntity } from "../data/FinetuneEntity";
import { Logger } from "../../tre/Logger";
import { FinetuneDto } from "common/src/app/models/FinetuneDto";
import { EntitiesDataSource } from "../../app/data/EntitiesDataSource";
import { BaseService } from "../../tre/services/BaseService";
import { ApiLogic } from "../logic/ApiLogic";
import { DatasetLogic } from "../logic/DatasetLogic";
import { FinetuneRepository } from "../data/FinetuneRepository";

export class FinetuneService extends BaseService {
    protected constructDataSource(): EntitiesDataSource {
        return new EntitiesDataSource();
    }

    public constructor(logger: Logger, app: express.Express) {
        super();

        logger.trace();

        app.get("/api/v0/finetune/:guid", (req, resp) => { this.responseDtoWrapper(req, resp, this.getGuid) });
        app.get("/api/v0/finetunes", (req, resp) => { this.responseDtoWrapper(req, resp, this.getList) });
        app.post("/api/v0/finetune", (req, resp) => { this.responseDtoWrapper(req, resp, this.postSave) });
        app.delete("/api/v0/finetune/:guid", (req, resp) => { this.responseDtoWrapper(req, resp, this.deleteGuid) });
    }

    public async getGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<FinetuneDto | null> {
        await logger.trace();
        await BaseService.checkSecurityName(logger, "Finetune:Read", req, ds);

        const guid = req.params["guid"];
        const ret = await new FinetuneRepository(ds).findOneBy({ guid: guid });
        return ret;
    }

    public async getList(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<FinetuneDto[]> {
        await logger.trace();
        await BaseService.checkSecurityName(logger, "Finetune:List", req, ds);

        const ret = await new FinetuneRepository(ds).find();
        return ret;
    }

    public async postSave(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurityName(logger, "Finetune:Save", req, ds);

        const requestDto = req.body as FinetuneDto;

        const entity = new FinetuneEntity();
        entity.copyFrom(requestDto);
        entity.trainingData = await DatasetLogic.createDataset(ds);
        await new FinetuneRepository(ds).save([entity]);

        entity.trainingFile = await ApiLogic.finetuneUpload(ds, entity.trainingData);
        entity.id = await ApiLogic.finetune(ds, entity);

        await new FinetuneRepository(ds).save([entity]);
    }

    public async deleteGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurityName(logger, "Finetune:Delete", req, ds);

        const guid = req.params["guid"];
        await new FinetuneRepository(ds).delete({ guid: guid });
    }
}