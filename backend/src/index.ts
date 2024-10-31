import express from "express";
import fs from "fs";
import path from "path";
import https from "https";
import { ResponseDto } from "common/src/models/ResponseDto";
import { Config } from "./Config";
import { AuthService } from "./services/AuthService";
import { GroupService } from "./services/GroupService";
import { MembershipService } from "./services/MembershipService";
import { PasswordService } from "./services/PasswordService";
import { PermissionService } from "./services/PermissionService";
import { SecurableService } from "./services/SecurableService";
import { UserService } from "./services/UserService";
import { FinetuneService } from "./services/FinetuneService";
import { MenuService } from "./services/MenusService";
import { ListService } from "./services/ListService";
import { ListFilterService } from "./services/ListFilterService";
import { SettingService } from "./services/SettingService";
import { AiciService } from "./services/AiciService";
import { DatasetService } from "./services/DatasetService";
import { PromptService } from "./services/PromptService";
import { Logger } from "./Logger";
import { UUIDv4 } from "common/src/logic/UUIDv4";

/**
 * WebApp class is responsible for initializing and configuring the Express application,
 * setting up middleware, serving static files, and starting the HTTPS server.
 */
export class WebApp {
    /** Express application instance */
    private app: express.Express = express();
    /** HTTPS server instance */
    public server: https.Server | undefined;

    /**
     * Execute method initializes the WebApp, configures middleware, sets up routes,
     * and starts the HTTPS server.
     */
    public async execute() {
        const logger = new Logger(UUIDv4.generate());

        await logger.always("ts-react-express");
        await logger.always(`Version: 0.0.0`);
        await logger.always("(c) Copyright Shawn Zernik 2024");

        this.app.use(async (req, res, next) => {
            let corelation = "";
            if (req.headers["corelation"] && req.headers["corelation"].length === 36) {
                corelation = req.headers["corelation"] as string;
            } else if (req.headers["corelation"] && req.headers["corelation"][0] && req.headers["corelation"][0].length === 36) {
                corelation = req.headers["corelation"]![0] as string;
            } else {
                corelation = UUIDv4.generate();
                await logger.always(`Injecting Corelation ${corelation}`);
            }
            req.headers["corelation"] = [corelation];

            const newLogger = new Logger(req.headers["corelation"][0]);
            await newLogger.always(`${req.method} ${req.originalUrl}`);

            next();
        });

        this.app.use(express.json({ limit: Config.httpsLimit }));

        logger.log(`Static Directory: ${path.resolve(Config.staticDirectory)}`);
        this.app.use("/static", express.static(Config.staticDirectory));

        this.app.get("/", (req, res) => {
            res.redirect("/static/pages/login.html");
        });

        logger.log(`JavaScript Directory: ${path.resolve(Config.javascriptDirectory)}`);
        this.app.use("/scripts", express.static(Config.javascriptDirectory));

        this.app.get("/api/v0/health", (req, res) => this.getHealth(logger, req, res));
        this.app.get("/api/v0/liveness", (req, res) => this.getLiveliness(logger, req, res));

        new AuthService(logger, this.app);
        new GroupService(logger, this.app);
        new MembershipService(logger, this.app);
        new PasswordService(logger, this.app);
        new PermissionService(logger, this.app);
        new SecurableService(logger, this.app);
        new UserService(logger, this.app);
        new FinetuneService(logger, this.app);
        new MenuService(logger, this.app);
        new ListService(logger, this.app);
        new ListFilterService(logger, this.app);
        new SettingService(logger, this.app);
        new PromptService(logger, this.app);

        new AiciService(logger, this.app);
        new DatasetService(logger, this.app);

        logger.log(`HTTPS Cert Path: ${path.resolve(Config.httpsCertPath)}`);
        logger.log(`HTTPS Key Path: ${path.resolve(Config.httpsKeyPath)}`);
        const options = {
            key: fs.readFileSync(Config.httpsKeyPath),

            cert: fs.readFileSync(Config.httpsCertPath),
        };
        this.server = https.createServer(options, this.app);
        this.server.listen(Config.httpsPort, async () => {
            await logger.always(`HTTPS Port: ${Config.httpsPort}`);
            await logger.always("Started");
        });
    }

    /**
     * Health check endpoint
     * @param logger Logger instance for logging
     * @param req Express request object
     * @param res Express response object
     */
    public async getHealth(logger: Logger, req: express.Request, res: express.Response) {
        await logger.trace();
        res.status(200).send({ data: "OK" } as ResponseDto<string>)
    }

    /**
     * Liveness check endpoint
     * @param logger Logger instance for logging
     * @param req Express request object
     * @param res Express response object
     */
    public async getLiveliness(logger: Logger, req: express.Request, res: express.Response) {
        await logger.trace();
        res.status(200).send({ data: "OK" } as ResponseDto<string>)
    }
}

const app = new WebApp();
app.execute();
