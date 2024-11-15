import express from "express";
import fs from "fs";
import path from "path";
import https from "https";
import { ResponseDto } from "common/src/tre/models/ResponseDto";
import { Config } from "../Config";
import { Logger } from "./Logger";
import { UUIDv4 } from "common/src/tre/logic/UUIDv4";

export class WebApp {
    public constructor(attachRoutes: (logger: Logger, app: express.Express) => void) {
        this.attachRoutes = attachRoutes;
    }

    private attachRoutes: (logger: Logger, app: express.Express) => void;
    private app: express.Express = express();
    public server: https.Server | undefined;

    public async execute() {
        const logger = new Logger(UUIDv4.generate());

        await logger.always(Config.appName);
        await logger.always(`Version: ${Config.appVersion}`);
        await logger.always(Config.appCopyright);

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

        logger.log(`JavaScript Directory: ${path.resolve(Config.javascriptDirectory)}`);
        this.app.use("/scripts", express.static(Config.javascriptDirectory));

        this.app.get("/", (req, res) => {
            res.redirect(Config.httpsDefaultPage);
        });

        this.app.get("/api/v0/health", (req, res) => this.getHealth(logger, req, res));
        this.app.get("/api/v0/liveness", (req, res) => this.getLiveliness(logger, req, res));

        this.attachRoutes(logger, this.app);

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

    public async getHealth(logger: Logger, req: express.Request, res: express.Response) {
        await logger.trace();
        res.status(200).send({ data: "OK" } as ResponseDto<string>)
    }

    public async getLiveliness(logger: Logger, req: express.Request, res: express.Response) {
        await logger.trace();
        res.status(200).send({ data: "OK" } as ResponseDto<string>)
    }
}