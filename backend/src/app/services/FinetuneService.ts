import express from "express";
import { FinetuneEntity } from "../data/FinetuneEntity";
import { Logger } from "../../tre/Logger";
import { FinetuneDto } from "common/src/app/models/FinetuneDto";
import { EntitiesDataSource } from "../../app/data/EntitiesDataSource";
import { BaseService } from "../../tre/services/BaseService";
import { ApiLogic } from "../logic/ApiLogic";
import { DatasetLogic } from "../logic/DatasetLogic";
import { FinetuneRepository } from "../data/FinetuneRepository";

/**
 * Service class for handling fine-tune related operations.
 */
export class FinetuneService extends BaseService {
    protected constructDataSource(): EntitiesDataSource {
        return new EntitiesDataSource();
    }

    /**
     * Constructor for the FinetuneService class.
     * @param logger - The logger instance for logging.
     * @param app - The express application instance.
     */
    public constructor(logger: Logger, app: express.Express) {
        super();

        logger.trace();

        app.get("/api/v0/finetune/:guid", (req, resp) => { this.methodWrapper(req, resp, this.getGuid) });
        app.get("/api/v0/finetunes", (req, resp) => { this.methodWrapper(req, resp, this.getList) });
        app.post("/api/v0/finetune", (req, resp) => { this.methodWrapper(req, resp, this.postSave) });
        app.delete("/api/v0/finetune/:guid", (req, resp) => { this.methodWrapper(req, resp, this.deleteGuid) });
    }

    /**
     * Retrieves a specific fine-tune entity by its GUID.
     * @param logger - The logger instance for logging.
     * @param req - The express request object.
     * @param ds - The data source instance.
     * @returns The FinetuneDto object or null if not found.
     */
    public async getGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<FinetuneDto | null> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Finetune:Read", req, ds);

        const guid = req.params["guid"];
        const ret = await new FinetuneRepository(ds).findOneBy({ guid: guid });
        return ret;
    }

    /**
     * Retrieves a list of all fine-tune entities.
     * @param logger - The logger instance for logging.
     * @param req - The express request object.
     * @param ds - The data source instance.
     * @returns An array of FinetuneDto objects.
     */
    public async getList(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<FinetuneDto[]> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Finetune:List", req, ds);

        const ret = await new FinetuneRepository(ds).find();
        return ret;
    }

    /**
     * Saves a new fine-tune entity.
     * @param logger - The logger instance for logging.
     * @param req - The express request object.
     * @param ds - The data source instance.
     */
    public async postSave(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Finetune:Save", req, ds);

        const requestDto = req.body as FinetuneDto;

        const entity = new FinetuneEntity();
        entity.copyFrom(requestDto);
        entity.trainingData = await DatasetLogic.createDataset(ds);
        await new FinetuneRepository(ds).save([entity]);

        entity.trainingFile = await ApiLogic.finetuneUpload(ds, entity.trainingData);
        entity.id = await ApiLogic.finetune(ds, entity);

        await new FinetuneRepository(ds).save([entity]);
    }

    /**
     * Deletes a specific fine-tune entity by its GUID.
     * @param logger - The logger instance for logging.
     * @param req - The express request object.
     * @param ds - The data source instance.
     */
    public async deleteGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Finetune:Delete", req, ds);

        const guid = req.params["guid"];
        await new FinetuneRepository(ds).delete({ guid: guid });
    }
}
