import express from "express";
import { HttpStatus } from "common/src/tre/HttpStatus";
import { ResponseDto } from "common/src/tre/models/ResponseDto";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { AuthLogic } from "../logic/AuthLogic";
import { Logger } from "../Logger";

export type Method<T> = (logger: Logger, req: express.Request, ds: EntitiesDataSource) => Promise<T>;

export abstract class BaseService {
    protected abstract constructDataSource(): EntitiesDataSource;

    protected static async checkSecurity(logger: Logger, securableName: string, req: express.Request, ds: EntitiesDataSource): Promise<AuthLogic> {
        await logger.trace()
        logger.log(`Check Security ${securableName}`)
        const authHeader = req.headers["authorization"]
        const authToken = authHeader && authHeader.split(" ")[1]

        if (!authToken)
            throw new Error("Missing token")

        const auth = await AuthLogic.tokenLogin(authToken)

        if (!auth.securables || auth.securables.length < 1)
            throw new Error("No securables!")

        for (let cnt = 0; cnt < auth.securables.length; cnt++) {
            if (auth.securables[cnt].displayName.toLowerCase() === securableName.toLowerCase())
                return auth
        }

        throw new Error(`Access denied for securable '${securableName}'!`)
    }

    protected async methodWrapper<T>(req: express.Request, resp: express.Response, method: Method<T>): Promise<void> {
        if (!req.headers["corelation"])
            throw new Error("Corelation header missing!")

        if (req.headers["corelation"].length > 1)
            throw new Error("Multiple corelation!")

        const logger = new Logger(req.headers["corelation"][0])

        if (!resp.status) {
            logger.warn("no resp.status")
            return
        }

        const ds = this.constructDataSource()

        try {
            await ds.initialize()
            const ret = await method(logger, req, ds)
            resp.status(HttpStatus.OK).send({ data: ret } as ResponseDto<any>)
        } catch (err: any) {
            resp.status(HttpStatus.BAD_REQUEST).send({ error: err["message"] } as ResponseDto<any>)
            console.error(err)
        } finally {
            await ds.destroy()
        }
    }
}