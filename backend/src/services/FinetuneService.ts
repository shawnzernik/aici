import express from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { BaseService } from "./BaseService";
import { FinetuneDto } from "common/src/models/FinetuneDto";
import { FinetuneEntity } from "../data/FinetuneEntity";
import { Logger } from "../Logger";
import { ApiLogic } from "../logic/aici/ApiLogic";
import { DatasetLogic } from "../logic/aici/DatasetLogic";

/**
 * Service class for handling fine-tune related operations.
 */
export class FinetuneService extends BaseService {
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
        const ret = await ds.finetuneRepository().findOneBy({ guid: guid });
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

        const ret = await ds.finetuneRepository().find();
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
        await ds.finetuneRepository().save([entity]);

        entity.trainingFile = await ApiLogic.finetuneUpload(ds, entity.trainingData);
        entity.id = await ApiLogic.finetune(ds, entity);

        await ds.finetuneRepository().save([entity]);
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
        await ds.finetuneRepository().delete({ guid: guid });
    }
}
