import express from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { BaseService } from "./BaseService";
import { PermissionDto } from "common/src/tre/models/PermissionDto";
import { PermissionEntity } from "../data/PermissionEntity";
import { PermissionLogic } from "../logic/PermissionLogic";
import { Logger } from "../Logger";
import { PermissionRepository } from "../data/PermissionsRepository";

/**
 * Service class for handling permission-related operations.
 */
export class PermissionService extends BaseService {
    protected constructDataSource(): EntitiesDataSource {
        return new EntitiesDataSource();
    }

    /**
     * Initializes a new instance of the PermissionService class.
     * @param logger - The logger to be used for logging.
     * @param app - The Express application to which the routes will be added.
     */
    public constructor(logger: Logger, app: express.Express) {
        super();

        logger.trace();

        app.get("/api/v0/permission/:guid", (req, resp) => { this.methodWrapper(req, resp, this.getGuid) });
        app.get("/api/v0/permissions", (req, resp) => { this.methodWrapper(req, resp, this.getList) });
        app.post("/api/v0/permission", (req, resp) => { this.methodWrapper(req, resp, this.postSave) });
        app.delete("/api/v0/permission/:guid", (req, resp) => { this.methodWrapper(req, resp, this.deleteGuid) });

        app.get("/api/v0/group/:guid/permissions", (req, resp) => { this.methodWrapper(req, resp, this.getGroupPermissions) });
        app.get("/api/v0/securable/:guid/permissions", (req, resp) => { this.methodWrapper(req, resp, this.getSecurablePermissions) });
    }

    /**
     * Retrieves the permissions associated with a specific group.
     * @param logger - The logger for tracing.
     * @param req - The HTTP request object.
     * @param ds - The data source used for accessing the database.
     * @returns A promise that resolves to an array of PermissionDto objects.
     */
    public async getGroupPermissions(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<PermissionDto[]> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Permission:Read", req, ds);

        const guid = req.params["guid"];
        const ret = await PermissionLogic.getGroupPermissions(ds, guid);
        return ret;
    }

    /**
     * Retrieves the permissions associated with a specific securable entity.
     * @param logger - The logger for tracing.
     * @param req - The HTTP request object.
     * @param ds - The data source used for accessing the database.
     * @returns A promise that resolves to an array of PermissionDto objects.
     */
    public async getSecurablePermissions(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<PermissionDto[]> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Permission:Read", req, ds);

        const guid = req.params["guid"];
        const ret = await PermissionLogic.getSecurablePermissions(ds, guid);
        return ret;
    }

    /**
     * Retrieves a permission entity by its GUID.
     * @param logger - The logger for tracing.
     * @param req - The HTTP request object.
     * @param ds - The data source used for accessing the database.
     * @returns A promise that resolves to a PermissionDto object or null if not found.
     */
    public async getGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<PermissionDto | null> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Permission:Read", req, ds);

        const guid = req.params["guid"];
        const ret = await new PermissionRepository(ds).findOneBy({ guid: guid });
        return ret;
    }

    /**
     * Retrieves a list of all permission entities.
     * @param logger - The logger for tracing.
     * @param req - The HTTP request object.
     * @param ds - The data source used for accessing the database.
     * @returns A promise that resolves to an array of PermissionDto objects.
     */
    public async getList(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<PermissionDto[]> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Permission:List", req, ds);

        const ret = await new PermissionRepository(ds).find();
        return ret;
    }

    /**
     * Saves a new permission entity.
     * @param logger - The logger for tracing.
     * @param req - The HTTP request object.
     * @param ds - The data source used for accessing the database.
     * @returns A promise that resolves when the save operation is complete.
     */
    public async postSave(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Permission:Save", req, ds);

        const entity = new PermissionEntity();
        entity.copyFrom(req.body as PermissionDto);
        await new PermissionRepository(ds).save([entity]);
    }

    /**
     * Deletes a permission entity by its GUID.
     * @param logger - The logger for tracing.
     * @param req - The HTTP request object.
     * @param ds - The data source used for accessing the database.
     * @returns A promise that resolves when the delete operation is complete.
     */
    public async deleteGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurity(logger, "Permission:Delete", req, ds);

        const guid = req.params["guid"];
        await new PermissionRepository(ds).delete({ guid: guid });
    }
}
