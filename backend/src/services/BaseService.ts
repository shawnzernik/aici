import express from "express";
import { HttpStatus } from "common/src/HttpStatus"
import { ResponseDto } from "common/src/models/ResponseDto";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { AuthLogic } from "../logic/AuthLogic";
import { Logger } from "../Logger";

/**
 * Type definition for a method that takes a logger, request, and data source,
 * and returns a Promise of type T.
 */
export type Method<T> = (logger: Logger, req: express.Request, ds: EntitiesDataSource) => Promise<T>;

/**
 * Base service class that provides common functionality for derived services.
 */
export class BaseService {

    /**
     * Checks the security for a given securable name in the request.
     * @param logger - Logger instance for logging purposes.
     * @param securableName - Name of the securable to check.
     * @param req - Express request object.
     * @param ds - Data source for accessing entities.
     * @returns Promise resolving to an instance of AuthLogic if access is granted.
     * @throws Error if the token is missing or access is denied for the securable.
     */
    protected static async checkSecurity(logger: Logger, securableName: string, req: express.Request, ds: EntitiesDataSource): Promise<AuthLogic> {
        await logger.trace();

        logger.log(`Check Security ${securableName}`);
        const authHeader = req.headers["authorization"];
        const authToken = authHeader && authHeader.split(" ")[1];
        if (!authToken)
            throw new Error("Missing token");

        const auth = await AuthLogic.tokenLogin(authToken);

        if (!auth.securables || auth.securables.length < 1)
            throw new Error("No securables!");

        for (let cnt = 0; cnt < auth.securables.length; cnt++) {
            if (auth.securables[cnt].displayName.toLowerCase() === securableName.toLowerCase())
                return auth;
        }

        throw new Error(`Access denied for securable '${securableName}'!`);
    }

    /**
     * Wrapper method that handles the request and response for a given method.
     * @param req - Express request object.
     * @param resp - Express response object.
     * @param method - The method to be called within the wrapper.
     * @returns Promise resolving to void.
     * @throws Error if the correlation header is missing or invalid.
     */
    protected async methodWrapper<T>(req: express.Request, resp: express.Response, method: Method<T>): Promise<void> {
        if (!req.headers["corelation"])
            throw new Error("Corelation header missing!");

        if (req.headers["corelation"].length > 1)
            throw new Error("Multiple corelation!");

        const logger = new Logger(req.headers["corelation"][0]);
        if (!resp.status) {
            logger.warn("no resp.status");
            return;
        }

        const ds = new EntitiesDataSource();

        try {
            await ds.initialize();
            const ret = await method(logger, req, ds);
            resp.status(HttpStatus.OK).send({ data: ret } as ResponseDto<any>);
        } catch (err: any) {
            resp.status(HttpStatus.BAD_REQUEST).send({ error: err["message"] } as ResponseDto<any>);
        } finally {
            await ds.destroy();
        }
    }
}
