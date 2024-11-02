import express from "express";
import { DatasetEntity } from "../data/DatasetEntity";
import { Logger } from "../../tre/Logger";
import { DatasetDto } from "common/src/app/models/DatasetDto";
import { EntitiesDataSource } from "../../app/data/EntitiesDataSource";
import { BaseService } from "../../tre/services/BaseService";
import { DatasetRepository } from "../data/DatasetRepository";

/**
 * Service for handling dataset-related operations.
 */
export class DatasetService extends BaseService {
    protected constructDataSource(): EntitiesDataSource {
        return new EntitiesDataSource();
    }

    /** 
     * Creates an instance of DatasetService. 
     * @param logger - Logger instance for logging purposes.
     * @param app - Express application instance.
     */
    public constructor(logger: Logger, app: express.Express) {
        super();

        logger.trace();

        app.get("/api/v0/dataset/:guid", (req, resp) => { this.methodWrapper(req, resp, this.getGuid) });
        app.get("/api/v0/datasets", (req, resp) => { this.methodWrapper(req, resp, this.getList) });
        app.post("/api/v0/dataset", (req, resp) => { this.methodWrapper(req, resp, this.postSave) });
        app.delete("/api/v0/dataset/:guid", (req, resp) => { this.methodWrapper(req, resp, this.deleteGuid) });
    }

    /** 
     * Retrieves a dataset by its GUID. 
     * @param logger - Logger instance for logging purposes.
     * @param req - Express request object containing the dataset GUID in the parameters.
     * @param ds - Data source for accessing entities.
     * @returns Promise resolving to a DatasetDto object or null if not found.
     */
    public async getGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<DatasetDto | null> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Dataset:Read", req, ds);

        const guid = req.params["guid"];
        const ret = await new DatasetRepository(ds).findOneBy({ guid: guid });
        return ret;
    }

    /** 
     * Retrieves the list of all datasets. 
     * @param logger - Logger instance for logging purposes.
     * @param req - Express request object.
     * @param ds - Data source for accessing entities.
     * @returns Promise resolving to an array of DatasetDto objects.
     */
    public async getList(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<DatasetDto[]> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Dataset:List", req, ds);

        const ret = await new DatasetRepository(ds).find();
        return ret;
    }

    /** 
     * Saves a new dataset entity. 
     * @param logger - Logger instance for logging purposes.
     * @param req - Express request object containing the dataset data in the body.
     * @param ds - Data source for accessing entities.
     * @returns Promise resolving to void.
     */
    public async postSave(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Dataset:Save", req, ds);

        const entity = new DatasetEntity();
        entity.copyFrom(req.body as DatasetDto);
        await new DatasetRepository(ds).save([entity]);
    }

    /** 
     * Deletes a dataset by its GUID. 
     * @param logger - Logger instance for logging purposes.
     * @param req - Express request object containing the dataset GUID in the parameters.
     * @param ds - Data source for accessing entities.
     * @returns Promise resolving to void.
     */
    public async deleteGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Dataset:Delete", req, ds);

        const guid = req.params["guid"];
        await new DatasetRepository(ds).delete({ guid: guid });
    }
}
