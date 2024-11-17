import express from "express";
import { PromptEntity } from "../data/PromptEntity";
import { Logger } from "../../tre/Logger";
import { PromptDto } from "common/src/app/models/PromptDto";
import { EntitiesDataSource } from "../../app/data/EntitiesDataSource";
import { BaseService } from "../../tre/services/BaseService";
import { PromptRepository } from "../data/PromptRepository";

export class PromptService extends BaseService {
    protected constructDataSource(): EntitiesDataSource {
        return new EntitiesDataSource();
    }

    public constructor(logger: Logger, app: express.Express) {
        super();
        logger.trace();
        app.get("/api/v0/prompt/:guid", (req, resp) => { this.responseDtoWrapper(req, resp, this.getGuid) });
        app.get("/api/v0/prompts", (req, resp) => { this.responseDtoWrapper(req, resp, this.getList) });
        app.post("/api/v0/prompt", (req, resp) => { this.responseDtoWrapper(req, resp, this.postSave) });
        app.delete("/api/v0/prompt/:guid", (req, resp) => { this.responseDtoWrapper(req, resp, this.deleteGuid) });
    }

    public async getGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<PromptDto | null> {
        await logger.trace();
        await BaseService.checkSecurityName(logger, "Prompt:Read", req, ds);

        const guid = req.params["guid"];
        const ret = await new PromptRepository(ds).findOneBy({ guid: guid });
        return ret;
    }

    public async getList(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<PromptDto[]> {
        await logger.trace();
        await BaseService.checkSecurityName(logger, "Prompt:List", req, ds);

        const ret = await new PromptRepository(ds).find();
        return ret;
    }

    public async postSave(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurityName(logger, "Prompt:Save", req, ds);

        const entity = new PromptEntity();
        entity.copyFrom(req.body as PromptDto);
        await new PromptRepository(ds).save([entity]);
    }

    public async deleteGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurityName(logger, "Prompt:Delete", req, ds);

        const guid = req.params["guid"];
        await new PromptRepository(ds).delete({ guid: guid });
    }
}