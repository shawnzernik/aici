import express from "express";
import { Response as AiciResponse } from "common/src/app/models/Response";
import { File as AiciFile } from "common/src/app/models/File";
import { LogDto } from "common/src/tre/models/LogDto";
import { EntitiesDataSource } from "../../app/data/EntitiesDataSource";
import { BaseService } from "../../tre/services/BaseService";
import { ApiLogic } from "../logic/ApiLogic";
import { UploadLogic } from "../logic/UploadLogic";
import { VectorLogic } from "../logic/VectorLogic";
import { Logger } from "../../tre/Logger";

/**
 * AiciService class that implements various APIs related to chat, upload, and search functionalities.
 * It extends the BaseService class and sets up the necessary routes in the Express application.
 */
export class AiciService extends BaseService {
    protected constructDataSource(): EntitiesDataSource {
        return new EntitiesDataSource();
    }

    /**
     * Constructs an instance of AiciService.
     * 
     * @param logger - The logger instance for logging operations.
     * @param app - The Express application instance for setting up routes.
     */
    public constructor(logger: Logger, app: express.Express) {
        super();

        logger.trace();

        app.post("/api/v0/aici/chat", (req, resp) => { this.methodWrapper(req, resp, this.postChat) });
        app.post("/api/v0/aici/upload", (req, resp) => { this.methodWrapper(req, resp, this.postUpload) });
        app.post("/api/v0/aici/download", (req, resp) => { this.methodWrapper(req, resp, this.postDownload) });
        app.post("/api/v0/aici/project", (req, resp) => { this.methodWrapper(req, resp, this.postProject) });
        app.get("/api/v0/aici/upload/:corelation", (req, resp) => { this.methodWrapper(req, resp, this.getUpload) });
        app.post("/api/v0/aici/search/:collection", (req, resp) => { this.methodWrapper(req, resp, this.postSearch) });
    }

    /**
     * Handles chat requests and returns a chat response.
     * 
     * @param logger - The logger instance for logging.
     * @param req - The request object containing chat data.
     * @param ds - The data source object for accessing the necessary entities.
     * @returns A promise that resolves to an AiciResponse containing the chat response.
     */
    public async postChat(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<AiciResponse> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Aici:Chat", req, ds);

        const aiResponse: AiciResponse = await ApiLogic.chat(ds, req.body);
        return aiResponse;
    }

    /**
     * Handles file upload requests. 
     * 
     * @param logger - The logger instance for logging.
     * @param req - The request object containing upload data.
     * @param ds - The data source object for accessing the necessary entities.
     * @returns A promise that resolves to void upon completion of the upload.
     */
    public async postUpload(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Aici:Upload", req, ds);

        UploadLogic.upload(logger, req.body);
    }

    /**
     * Handles file download requests.
     * 
     * @param logger - The logger instance for logging.
     * @param req - The request object for the download.
     * @param ds - The data source object for accessing the necessary entities.
     * @returns A promise that resolves to an AiciFile containing the downloaded file data.
     */
    public async postDownload(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<AiciFile> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Aici:Download", req, ds);

        const ret = await UploadLogic.download(ds, req.body);
        return ret;
    }

    public async postProject(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<AiciFile> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Aici:Project", req, ds);

        const ret = await UploadLogic.project(ds, req.body);
        return ret;
    }

    /**
     * Handles search requests and returns search results.
     * 
     * @param logger - The logger instance for logging.
     * @param req - The request object containing search parameters.
     * @param ds - The data source object for accessing the necessary entities.
     * @returns A promise that resolves to the search results.
     */
    public async postSearch(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<any> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Aici:Embedding", req, ds);

        const collection = req.params["collection"];
        const obj = req.body;
        if (!obj.input)
            throw new Error("No input provided!  Expected TypeScript interface: `{ input: string, limit: number }`.");
        if (!obj.limit)
            throw new Error("No input provided!  Expected TypeScript interface: `{ input: string, limit: number }`.");

        const ret = await VectorLogic.search(ds, collection, obj.input, obj.limit);
        return ret;
    }

    /**
     * Retrieves upload logs based on a correlation ID.
     * 
     * @param logger - The logger instance for logging.
     * @param req - The request object that contains the correlation parameter.
     * @param ds - The data source object for accessing the necessary entities.
     * @returns A promise that resolves to an array of LogDto containing the upload logs.
     */
    public async getUpload(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<LogDto[]> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Aici:Upload", req, ds);

        const corelation = req.params["corelation"];
        const ret = await UploadLogic.getUploadLogs(ds, corelation);
        return ret;
    }
}
