import express from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { BaseService } from "./BaseService";
import { GroupDto } from "common/src/tre/models/GroupDto";
import { GroupEntity } from "../data/GroupEntity";
import { Logger } from "../Logger";
import { GroupRepository } from "../data/GroupRepository";

export class GroupService extends BaseService {
    protected constructDataSource(): EntitiesDataSource {
        return new EntitiesDataSource();
    }

    public constructor(logger: Logger, app: express.Express) {
        super();

        logger.trace();

        app.get("/api/v0/group/:guid", (req, resp) => { this.responseDtoWrapper(req, resp, this.getGuid) });
        app.get("/api/v0/groups", (req, resp) => { this.responseDtoWrapper(req, resp, this.getList) });
        app.post("/api/v0/group", (req, resp) => { this.responseDtoWrapper(req, resp, this.postSave) });
        app.delete("/api/v0/group/:guid", (req, resp) => { this.responseDtoWrapper(req, resp, this.deleteGuid) });
    }

    public async getGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<GroupDto | null> {
        await logger.trace();
        await BaseService.checkSecurityName(logger, "Group:Read", req, ds);

        const guid = req.params["guid"];
        const ret = await new GroupRepository(ds).findOneBy({ guid: guid });
        return ret;
    }

    public async getList(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<GroupDto[]> {
        await logger.trace();
        await BaseService.checkSecurityName(logger, "Group:List", req, ds);

        const ret = await new GroupRepository(ds).find();
        return ret;
    }

    public async postSave(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurityName(logger, "Group:Save", req, ds);

        const entity = new GroupEntity();
        entity.copyFrom(req.body as GroupDto);
        await new GroupRepository(ds).save([entity]);
    }

    public async deleteGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurityName(logger, "Group:Delete", req, ds);

        const guid = req.params["guid"];
        await new GroupRepository(ds).delete({ guid: guid });
    }
}