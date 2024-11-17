import express from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { BaseService } from "./BaseService";
import { SecurableDto } from "common/src/tre/models/SecurableDto";
import { SecurableEntity } from "../data/SecurableEntity";
import { Logger } from "../Logger";
import { SecurableRepository } from "../data/SecurableRepository";

export class SecurableService extends BaseService {
    protected constructDataSource(): EntitiesDataSource {
        return new EntitiesDataSource();
    }

    public constructor(logger: Logger, app: express.Express) {
        super();

        logger.trace();

        app.get("/api/v0/securable/:guid", (req, resp) => { this.responseDtoWrapper(req, resp, this.getGuid) });
        app.get("/api/v0/securables", (req, resp) => { this.responseDtoWrapper(req, resp, this.getList) });
        app.post("/api/v0/securable", (req, resp) => { this.responseDtoWrapper(req, resp, this.postSave) });
        app.delete("/api/v0/securable/:guid", (req, resp) => { this.responseDtoWrapper(req, resp, this.deleteGuid) });
    }

    public async getGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<SecurableDto | null> {
        await logger.trace();
        await BaseService.checkSecurityName(logger, "Securable:Read", req, ds);

        const guid = req.params["guid"];
        const ret = await new SecurableRepository(ds).findOneBy({ guid: guid });
        return ret;
    }

    public async getList(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<SecurableDto[]> {
        await logger.trace();
        await BaseService.checkSecurityName(logger, "Securable:List", req, ds);

        const ret = await new SecurableRepository(ds).find({ order: { displayName: "ASC" } });
        return ret;
    }

    public async postSave(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurityName(logger, "Securable:Save", req, ds);

        const entity = new SecurableEntity();
        entity.copyFrom(req.body as SecurableDto);
        await new SecurableRepository(ds).save([entity]);
    }

    public async deleteGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurityName(logger, "Securable:Delete", req, ds);

        const guid = req.params["guid"];
        await new SecurableRepository(ds).delete({ guid: guid });
    }
}