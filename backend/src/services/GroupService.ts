import express from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { BaseService } from "./BaseService";
import { GroupDto } from "common/src/models/GroupDto";
import { GroupEntity } from "../data/GroupEntity";
import { Logger } from "../Logger";

/**
 * Service for handling group-related operations.
 */
export class GroupService extends BaseService {
    /**
     * Creates an instance of GroupService.
     * @param logger - Logger instance for logging purposes.
     * @param app - Express application instance.
     */
    public constructor(logger: Logger, app: express.Express) {
        super();

        logger.trace();

        app.get("/api/v0/group/:guid", (req, resp) => { this.methodWrapper(req, resp, this.getGuid) });
        app.get("/api/v0/groups", (req, resp) => { this.methodWrapper(req, resp, this.getList) });
        app.post("/api/v0/group", (req, resp) => { this.methodWrapper(req, resp, this.postSave) });
        app.delete("/api/v0/group/:guid", (req, resp) => { this.methodWrapper(req, resp, this.deleteGuid) });
    }

    /**
     * Retrieves a group by its GUID.
     * @param logger - Logger instance for logging purposes.
     * @param req - Express request object containing the group GUID in the parameters.
     * @param ds - Data source for accessing entities.
     * @returns Promise resolving to a GroupDto object or null if not found.
     */
    public async getGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<GroupDto | null> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Group:Read", req, ds);

        const guid = req.params["guid"];
        const ret = await ds.groupRepository().findOneBy({ guid: guid });
        return ret;
    }

    /**
     * Retrieves the list of all groups.
     * @param logger - Logger instance for logging purposes.
     * @param req - Express request object.
     * @param ds - Data source for accessing entities.
     * @returns Promise resolving to an array of GroupDto objects.
     */
    public async getList(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<GroupDto[]> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Group:List", req, ds);

        const ret = await ds.groupRepository().find();
        return ret;
    }

    /**
     * Saves a new group entity.
     * @param logger - Logger instance for logging purposes.
     * @param req - Express request object containing the group data in the body.
     * @param ds - Data source for accessing entities.
     * @returns Promise resolving to void.
     */
    public async postSave(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Group:Save", req, ds);

        const entity = new GroupEntity();
        entity.copyFrom(req.body as GroupDto);
        await ds.groupRepository().save([entity]);
    }

    /**
     * Deletes a group by its GUID.
     * @param logger - Logger instance for logging purposes.
     * @param req - Express request object containing the group GUID in the parameters.
     * @param ds - Data source for accessing entities.
     * @returns Promise resolving to void.
     */
    public async deleteGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Group:Delete", req, ds);

        const guid = req.params["guid"];
        await ds.groupRepository().delete({ guid: guid });
    }
}
