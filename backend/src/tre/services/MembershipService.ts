import express from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { MembershipEntity } from "../data/MembershipEntity";
import { BaseService } from "./BaseService";
import { MembershipDto } from "common/src/tre/models/MembershipDto";
import { MembershipLogic } from "../logic/MembershipLogic";
import { Logger } from "../Logger";
import { MembershipRepository } from "../data/MembershipsRepository";

export class MembershipService extends BaseService {
    protected constructDataSource(): EntitiesDataSource {
        return new EntitiesDataSource();
    }

    public constructor(logger: Logger, app: express.Express) {
        super();

        logger.trace();

        app.get("/api/v0/membership/:guid", (req, resp) => { this.responseDtoWrapper(req, resp, this.getGuid) });
        app.get("/api/v0/memberships", (req, resp) => { this.responseDtoWrapper(req, resp, this.getList) });
        app.post("/api/v0/membership", (req, resp) => { this.responseDtoWrapper(req, resp, this.postSave) });
        app.delete("/api/v0/membership/:guid", (req, resp) => { this.responseDtoWrapper(req, resp, this.deleteGuid) });

        app.get("/api/v0/group/:guid/memberships", (req, resp) => { this.responseDtoWrapper(req, resp, this.getGroupMemberships) });
        app.get("/api/v0/user/:guid/memberships", (req, resp) => { this.responseDtoWrapper(req, resp, this.getUserMemberships) });
    }

    public async getGroupMemberships(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<MembershipDto[]> {
        await logger.trace();
        await BaseService.checkSecurityName(logger, "Membership:Read", req, ds);

        const guid = req.params["guid"];
        const ret = await MembershipLogic.getGroupMemberships(ds, guid);
        return ret;
    }

    public async getUserMemberships(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<MembershipDto[]> {
        await logger.trace();
        await BaseService.checkSecurityName(logger, "Membership:Read", req, ds);

        const guid = req.params["guid"];
        const ret = await MembershipLogic.getUserMemberships(ds, guid);
        return ret;
    }

    public async getGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<MembershipDto | null> {
        await logger.trace();
        await BaseService.checkSecurityName(logger, "Membership:Read", req, ds);

        const guid = req.params["guid"];
        const ret = await new MembershipRepository(ds).findOneBy({ guid: guid });
        return ret;
    }

    public async getList(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<MembershipDto[]> {
        await logger.trace();
        await BaseService.checkSecurityName(logger, "Membership:List", req, ds);

        const ret = await new MembershipRepository(ds).find();
        return ret;
    }

    public async postSave(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurityName(logger, "Membership:Save", req, ds);

        const entity = new MembershipEntity();
        entity.copyFrom(req.body as MembershipEntity);
        await new MembershipRepository(ds).save([entity]);
    }

    public async deleteGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurityName(logger, "Membership:Delete", req, ds);

        const guid = req.params["guid"];
        await new MembershipRepository(ds).delete({ guid: guid });
    }
}