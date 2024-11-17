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

export class AiciService extends BaseService {
    protected constructDataSource(): EntitiesDataSource {
        return new EntitiesDataSource();
    }

    public constructor(logger: Logger, app: express.Express) {
        super();

        logger.trace();

        app.post("/api/v0/aici/chat", (req, resp) => { this.responseDtoWrapper(req, resp, this.postChat) });
        app.post("/api/v0/aici/upload", (req, resp) => { this.responseDtoWrapper(req, resp, this.postUpload) });
        app.post("/api/v0/aici/save", (req, resp) => { this.responseDtoWrapper(req, resp, this.postSave) });
        app.post("/api/v0/aici/download", (req, resp) => { this.responseDtoWrapper(req, resp, this.postDownload) });
        app.post("/api/v0/aici/project", (req, resp) => { this.responseDtoWrapper(req, resp, this.postProject) });
        app.get("/api/v0/aici/upload/:corelation", (req, resp) => { this.responseDtoWrapper(req, resp, this.getUpload) });
        app.post("/api/v0/aici/search/:collection", (req, resp) => { this.responseDtoWrapper(req, resp, this.postSearch) });
    }

    public async postChat(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<AiciResponse> {
        await logger.trace();
        await BaseService.checkSecurityName(logger, "Aici:Chat", req, ds);

        const aiResponse: AiciResponse = await ApiLogic.chat(ds, req.body);
        return aiResponse;
    }

    public async postUpload(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurityName(logger, "Aici:Upload", req, ds);

        UploadLogic.upload(logger, req.body);
    }

    public async postSave(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurityName(logger, "Aici:Save", req, ds);

        UploadLogic.save(logger, req.body);
    }

    public async postDownload(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<AiciFile> {
        await logger.trace();
        await BaseService.checkSecurityName(logger, "Aici:Download", req, ds);

        const ret = await UploadLogic.download(ds, req.body);
        return ret;
    }

    public async postProject(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<AiciFile> {
        await logger.trace();
        await BaseService.checkSecurityName(logger, "Aici:Project", req, ds);

        const ret = await UploadLogic.project(ds, req.body);
        return ret;
    }

    public async postSearch(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<any> {
        await logger.trace();
        await BaseService.checkSecurityName(logger, "Aici:Embedding", req, ds);

        const collection = req.params["collection"];
        const obj = req.body;
        if (!obj.input)
            throw new Error("No input provided!  Expected TypeScript interface: `{ input: string, limit: number }`.");
        if (!obj.limit)
            throw new Error("No input provided!  Expected TypeScript interface: `{ input: string, limit: number }`.");

        const ret = await VectorLogic.search(ds, collection, obj.input, obj.limit);
        return ret;
    }

    public async getUpload(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<LogDto[]> {
        await logger.trace();
        await BaseService.checkSecurityName(logger, "Aici:Upload", req, ds);

        const corelation = req.params["corelation"];
        const ret = await UploadLogic.getUploadLogs(ds, corelation);
        return ret;
    }
}