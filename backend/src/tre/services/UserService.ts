import express from "express";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { BaseService } from "./BaseService";
import { UserDto } from "common/src/tre/models/UserDto";
import { UserEntity } from "../data/UserEntity";
import { PasswordLogic } from "../logic/PasswordLogic";
import { Logger } from "../Logger";
import { UserRepository } from "../data/UserRepository";
import { PasswordRepository } from "../data/PasswordRepository";

export class UserService extends BaseService {
    protected constructDataSource(): EntitiesDataSource {
        return new EntitiesDataSource();
    }

    public constructor(logger: Logger, app: express.Express) {
        super();

        logger.trace();

        app.get("/api/v0/user/:guid", (req, resp) => { this.responseDtoWrapper(req, resp, this.getGuid) });
        app.get("/api/v0/users", (req, resp) => { this.responseDtoWrapper(req, resp, this.getList) });
        app.post("/api/v0/user", (req, resp) => { this.responseDtoWrapper(req, resp, this.postSave) });
        app.delete("/api/v0/user/:guid", (req, resp) => { this.responseDtoWrapper(req, resp, this.deleteGuid) });
        app.post("/api/v0/user/:guid/password", (req, resp) => { this.responseDtoWrapper(req, resp, this.postPassword) });
    }

    public async getGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<UserDto | null> {
        await logger.trace();
        await BaseService.checkSecurityName(logger, "User:Read", req, ds);

        const guid = req.params["guid"];
        const ret = await new UserRepository(ds).findOneBy({ guid: guid });
        return ret;
    }

    public async getList(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<UserDto[]> {
        await logger.trace();
        await BaseService.checkSecurityName(logger, "User:List", req, ds);

        const ret = await new UserRepository(ds).find({ order: { emailAddress: "ASC" } });
        return ret;
    }

    public async postSave(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurityName(logger, "User:Save", req, ds);

        const entity = new UserEntity();
        entity.copyFrom(req.body as UserDto);
        await new UserRepository(ds).save([entity]);
    }

    public async deleteGuid(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurityName(logger, "User:Delete", req, ds);

        const guid = req.params["guid"];
        await new UserRepository(ds).delete({ guid: guid });
    }

    public async postPassword(logger: Logger, req: express.Request, ds: EntitiesDataSource): Promise<void> {
        await logger.trace();
        await BaseService.checkSecurityName(logger, "User:Password", req, ds);

        const guid = req.params["guid"];

        const passLogic = new PasswordLogic();
        const passEntity = await passLogic.reset(ds, guid, req.body["password"], req.body["confirm"]);
        await new PasswordRepository(ds).save(passEntity);
    }
}
