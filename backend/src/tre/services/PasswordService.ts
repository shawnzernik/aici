import express from "express";
import { Logger } from "../Logger";
import { BaseService } from "./BaseService";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { PasswordDto } from "common/src/tre/models/PasswordDto";
import { PasswordEntity } from "../data/PasswordEntity";
import { PasswordRepository } from "../data/PasswordRepository";

export class PasswordService extends BaseService {
    protected constructDataSource(): EntitiesDataSource {
        return new EntitiesDataSource();
    }

    public constructor(logger: Logger, app: express.Express) {
        super();

        logger.trace();

        app.get("/api/v0/password/:guid", (req, resp) => { this.responseDtoWrapper(req, resp, this.getGuid) });
        app.get("/api/v0/passwords", (req, resp) => { this.responseDtoWrapper(req, resp, this.getList) });
        app.post("/api/v0/password", (req, resp) => { this.responseDtoWrapper(req, resp, this.postSave) });
        app.delete("/api/v0/password/:guid", (req, resp) => { this.responseDtoWrapper(req, resp, this.deleteGuid) });
    }

    public async getGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<PasswordDto | null> {
        await logger.trace();
        await BaseService.checkSecurityName(logger, "Password:Read", req, ds);

        const guid = req.params["guid"];
        const ret = await new PasswordRepository(ds).findOneBy({ guid: guid });
        return ret;
    }

    public async getList(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<PasswordDto[]> {
        await logger.trace();
        await BaseService.checkSecurityName(logger, "Password:List", req, ds);

        const ret = await new PasswordRepository(ds).find();
        return ret;
    }

    public async postSave(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurityName(logger, "Password:Save", req, ds);

        const entity = new PasswordEntity();
        entity.copyFrom(req.body as PasswordDto);
        await new PasswordRepository(ds).save([entity]);
    }

    public async deleteGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurityName(logger, "Password:Delete", req, ds);

        const guid = req.params["guid"];
        await new PasswordRepository(ds).delete({ guid: guid });
    }
}
