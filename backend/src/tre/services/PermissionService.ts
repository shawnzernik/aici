import express from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { BaseService } from "./BaseService";
import { PermissionDto } from "common/src/tre/models/PermissionDto";
import { PermissionEntity } from "../data/PermissionEntity";
import { PermissionLogic } from "../logic/PermissionLogic";
import { Logger } from "../Logger";
import { PermissionRepository } from "../data/PermissionsRepository";

export class PermissionService extends BaseService {
    protected constructDataSource(): EntitiesDataSource {
        return new EntitiesDataSource();
    }

    public constructor(logger: Logger, app: express.Express) {
        super();

        logger.trace();

        app.get("/api/v0/permission/:guid", (req, resp) => { this.responseDtoWrapper(req, resp, this.getGuid) });
        app.get("/api/v0/permissions", (req, resp) => { this.responseDtoWrapper(req, resp, this.getList) });
        app.post("/api/v0/permission", (req, resp) => { this.responseDtoWrapper(req, resp, this.postSave) });
        app.delete("/api/v0/permission/:guid", (req, resp) => { this.responseDtoWrapper(req, resp, this.deleteGuid) });

        app.get("/api/v0/group/:guid/permissions", (req, resp) => { this.responseDtoWrapper(req, resp, this.getGroupPermissions) });
        app.get("/api/v0/securable/:guid/permissions", (req, resp) => { this.responseDtoWrapper(req, resp, this.getSecurablePermissions) });
    }

    public async getGroupPermissions(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<PermissionDto[]> {
        await logger.trace();
        await BaseService.checkSecurityName(logger, "Permission:Read", req, ds);

        const guid = req.params["guid"];
        const ret = await PermissionLogic.getGroupPermissions(ds, guid);
        return ret;
    }

    public async getSecurablePermissions(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<PermissionDto[]> {
        await logger.trace();
        await BaseService.checkSecurityName(logger, "Permission:Read", req, ds);

        const guid = req.params["guid"];
        const ret = await PermissionLogic.getSecurablePermissions(ds, guid);
        return ret;
    }

    public async getGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<PermissionDto | null> {
        await logger.trace();
        await BaseService.checkSecurityName(logger, "Permission:Read", req, ds);

        const guid = req.params["guid"];
        const ret = await new PermissionRepository(ds).findOneBy({ guid: guid });
        return ret;
    }

    public async getList(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<PermissionDto[]> {
        await logger.trace();
        await BaseService.checkSecurityName(logger, "Permission:List", req, ds);

        const ret = await new PermissionRepository(ds).find();
        return ret;
    }

    public async postSave(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurityName(logger, "Permission:Save", req, ds);

        const entity = new PermissionEntity();
        entity.copyFrom(req.body as PermissionDto);
        await new PermissionRepository(ds).save([entity]);
    }

    public async deleteGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurityName(logger, "Permission:Delete", req, ds);

        const guid = req.params["guid"];
        await new PermissionRepository(ds).delete({ guid: guid });
    }
}