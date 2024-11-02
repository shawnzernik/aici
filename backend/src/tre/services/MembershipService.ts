import express from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { MembershipEntity } from "../data/MembershipEntity";
import { BaseService } from "./BaseService";
import { MembershipDto } from "common/src/tre/models/MembershipDto";
import { MembershipLogic } from "../logic/MembershipLogic";
import { Logger } from "../Logger";
import { MembershipRepository } from "../data/MembershipsRepository";

/**
 * Service class for managing memberships.
 */
export class MembershipService extends BaseService {
    protected constructDataSource(): EntitiesDataSource {
        return new EntitiesDataSource();
    }

    /**
     * Constructor for MembershipService.
     * 
     * @param logger - Logger instance for logging.
     * @param app - Express application instance.
     */
    public constructor(logger: Logger, app: express.Express) {
        super();

        logger.trace();

        app.get("/api/v0/membership/:guid", (req, resp) => { this.methodWrapper(req, resp, this.getGuid) });
        app.get("/api/v0/memberships", (req, resp) => { this.methodWrapper(req, resp, this.getList) });
        app.post("/api/v0/membership", (req, resp) => { this.methodWrapper(req, resp, this.postSave) });
        app.delete("/api/v0/membership/:guid", (req, resp) => { this.methodWrapper(req, resp, this.deleteGuid) });

        app.get("/api/v0/group/:guid/memberships", (req, resp) => { this.methodWrapper(req, resp, this.getGroupMemberships) });
        app.get("/api/v0/user/:guid/memberships", (req, resp) => { this.methodWrapper(req, resp, this.getUserMemberships) });
    }

    /**
     * Retrieves memberships for a specific group.
     * 
     * @param logger - Logger instance for logging.
     * @param req - Express request object.
     * @param ds - Data source instance.
     * @returns Array of Membership DTOs.
     */
    public async getGroupMemberships(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<MembershipDto[]> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Membership:Read", req, ds);

        const guid = req.params["guid"];
        const ret = await MembershipLogic.getGroupMemberships(ds, guid);
        return ret;
    }

    /**
     * Retrieves memberships for a specific user.
     * 
     * @param logger - Logger instance for logging.
     * @param req - Express request object.
     * @param ds - Data source instance.
     * @returns Array of Membership DTOs.
     */
    public async getUserMemberships(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<MembershipDto[]> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Membership:Read", req, ds);

        const guid = req.params["guid"];
        const ret = await MembershipLogic.getUserMemberships(ds, guid);
        return ret;
    }

    /**
     * Retrieves a specific membership by GUID.
     * 
     * @param logger - Logger instance for logging.
     * @param req - Express request object.
     * @param ds - Data source instance.
     * @returns Membership DTO or null if not found.
     */
    public async getGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<MembershipDto | null> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Membership:Read", req, ds);

        const guid = req.params["guid"];
        const ret = await new MembershipRepository(ds).findOneBy({ guid: guid });
        return ret;
    }

    /**
     * Retrieves a list of all memberships.
     * 
     * @param logger - Logger instance for logging.
     * @param req - Express request object.
     * @param ds - Data source instance.
     * @returns Array of Membership DTOs.
     */
    public async getList(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<MembershipDto[]> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Membership:List", req, ds);

        const ret = await new MembershipRepository(ds).find();
        return ret;
    }

    /**
     * Saves a new membership entity.
     * 
     * @param logger - Logger instance for logging.
     * @param req - Express request object.
     * @param ds - Data source instance.
     */
    public async postSave(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Membership:Save", req, ds);

        const entity = new MembershipEntity();
        entity.copyFrom(req.body as MembershipEntity);
        await new MembershipRepository(ds).save([entity]);
    }

    /**
     * Deletes a specific membership by GUID.
     * 
     * @param logger - Logger instance for logging.
     * @param req - Express request object.
     * @param ds - Data source instance.
     */
    public async deleteGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Membership:Delete", req, ds);

        const guid = req.params["guid"];
        await new MembershipRepository(ds).delete({ guid: guid });
    }
}
