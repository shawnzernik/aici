import path from "path";
import child_process from "child_process";
import fs from "fs";
import { Client } from "pg";
import { ConfigDto } from "./ConfigDto";
import { DataSource } from "typeorm";
import { ManagerVersionEntity } from "./ManagerVersionEntity";
import { Version } from "./Version";
import { ManagerVersionRepository } from "./ManagerVersionRepository";
import { UUIDv4 } from "./UUIDv4";
import { ManagerVersionDto } from "./ManagerVersionDto";
import { Config } from "../Config";

export class Manager {
    private logs: string = "";

    private usage = "Command line arguments are invalid!  The following options are available:\n" +
        "    npx ts-node src/index.ts new\n" +
        "    npx ts-node src/index.ts upgrade\n" +
        "    npx ts-node src/index.ts backup [name]\n" +
        "    npx ts-node src/index.ts restore [name]\n";

    public async execute(argv: string[]): Promise<void> {
        this.log("Manager.execute() - TS React Express Database Manager");

        const action = argv[2];
        const parm = argv[3];

        const configJson = fs.readFileSync("src/Config.json", { encoding: "utf8" });
        const config = JSON.parse(configJson) as ConfigDto;

        this.log("Manager.execute() - " + action);
        if (action == "new")
            await this.newDatabase(config);
        else if (action == "upgrade")
            await this.upgrade(config);
        else if (action == "backup" && parm)
            await this.backup(parm);
        else if (action == "restore" && parm)
            await this.restore(parm);
        else
            throw new Error(this.usage);

        this.log("Manager.execute() - DONE!");
    }

    private async executeSql(db: string, sql: string): Promise<void> {
        this.log("Manager.executeSql() - " + db);

        const pgClient = new Client({
            host: Config.dbHost,
            port: Config.dbPort,
            user: Config.dbUsername,
            password: Config.dbPassword,
            database: db
        });
        try {
            await pgClient.connect();
            await pgClient.query(sql);
        }
        finally {
            pgClient.end();
        }
    }
    private async closeConnections() {
        this.log("Manager.closeConnections() - " + Config.dbName);

        await this.executeSql("postgres", `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${Config.dbName}' AND pid <> pg_backend_pid();`);
    }
    private async dropDatabase() {
        this.log("Manager.dropDatabase() - " + Config.dbName);

        await this.closeConnections();
        await this.executeSql("postgres", `DROP DATABASE IF EXISTS "${Config.dbName}"`);
    }
    private async createDatabase() {
        this.log("Manager.createDatabase() - " + Config.dbName);

        await this.executeSql("postgres", `CREATE DATABASE "${Config.dbName}"`);
    }

    private async newDatabase(config: ConfigDto) {
        this.log("Manager.newDatabase()");

        await this.dropDatabase();
        await this.createDatabase();

        this.log("Manager.newDatabase() - running 0.0.0");

        const scripts = config["0.0.0"];
        for (const script of scripts)
            await this.executeSqlScript(new Version("0.0.0"), script);

        await this.updateVersion(new Version("0.0.0"));

        await this.upgrade(config);
    }
    private async backup(filename: string) {
        this.log("Manager.backup()");

        if (!fs.existsSync("temp"))
            fs.mkdirSync("temp");

        const fullpath = path.join("temp", filename);

        this.log("Manager.backup() - " + fullpath);

        process.env["PGPASSWORD"] = Config.dbPassword;
        const cmd = `pg_dump -h "${Config.dbHost}" -p "${Config.dbPort}" -U "${Config.dbUsername}" -d "${Config.dbName}"`;
        const out = await this.executeCmd(cmd);

        fs.writeFileSync(fullpath, out, { encoding: "utf8" });

        this.log("Manager.backup() - finished");
    }
    private async restore(filename: string) {
        this.log("Manager.restore()");

        await this.dropDatabase();
        await this.createDatabase();

        const fullpath = path.join("temp", filename);

        this.log("Manager.restore() - " + fullpath);

        process.env["PGPASSWORD"] = Config.dbPassword;
        const cmd = `psql -h "${Config.dbHost}" -p "${Config.dbPort}" -U "${Config.dbUsername}" -d "${Config.dbName}" -f "${fullpath}"`;
        const out = await this.executeCmd(cmd);

        fs.writeFileSync(fullpath, out, { encoding: "utf8" });

        this.log("Manager.restore() - finished");
    }
    private async upgrade(config: ConfigDto) {
        this.log("Manager.upgrade()");

        // get version from database
        const currentVersion = await this.getCurrentVersion();

        // get versions in config
        let versions: Version[] = [];
        for (const value in config)
            versions.push(new Version(value));
        versions.sort(Version.compare);

        // check if upgrade needed
        const compared = Version.compare(currentVersion, versions[versions.length - 1]);
        if (compared > 0)
            throw new Error(`Database version ${currentVersion.toString()} is ahead of ${versions[versions.length - 1].toString()}`);
        if (compared == 0)
            throw new Error(`Database version ${currentVersion.toString()} equal to ${versions[versions.length - 1].toString()}`);

        // backup database
        const now = new Date().toISOString().replace(/-/g, "").replace(/:/g, "");
        const filename = `Upgrade-${now}-From${currentVersion.toString()}-To${versions[versions.length - 1].toString()}.sql`;
        await this.backup(filename);

        // execute scripts
        for (let cnt = 0; cnt < versions.length; cnt++) {
            const target = versions[cnt];
            if (Version.compare(currentVersion, target) >= 0)
                continue;

            this.log("Manager.upgrade() - version " + target.toString());

            const scripts = config[target.toString()];
            for (const script of scripts)
                await this.executeSqlScript(target, script);

            await this.updateVersion(target);
        }
    }
    private async updateVersion(target: Version) {
        this.log("Manager.updateVersion() - " + target.toString());

        const dto: ManagerVersionDto = {
            guid: UUIDv4.generate(),
            occurred: new Date(),
            success: true,
            log: this.logs,
            version: target.toString()
        };

        const ds = new DataSource({
            type: "postgres",
            host: Config.dbHost,
            port: Config.dbPort,
            database: Config.dbName,
            username: Config.dbUsername,
            password: Config.dbPassword,
            entities: [ManagerVersionEntity]
        });

        try {
            await ds.initialize();
            const repo = new ManagerVersionRepository(ds);
            await repo.save(dto);
        }
        finally {
            await ds.destroy();
        }
    }
    private async executeSqlScript(version: Version, filename: string) {
        this.log("Manager.executeSqlScript() - " + version.toString() + " - " + filename);

        const folder = version.toString();
        const fullpath = path.join(folder, filename);

        const sql = fs.readFileSync(fullpath, { encoding: "utf8" });
        await this.executeSql(Config.dbName, sql);
    }
    private log(out: string) {
        console.log(out);
        this.logs += out + "\n";
    }
    private async getCurrentVersion(): Promise<Version> {
        this.log("Manager.getCurrentVersion()");

        const ds = new DataSource({
            type: "postgres",
            host: Config.dbHost,
            port: Config.dbPort,
            database: Config.dbName,
            username: Config.dbUsername,
            password: Config.dbPassword,
            entities: [ManagerVersionEntity]
        });

        try {
            await ds.initialize();

            const repo = new ManagerVersionRepository(ds);
            const managerVersion = await repo.findOne({
                where: { success: true },
                order: { occurred: "DESC" }
            });

            this.log("Manager.getCurrentVersion() - " + managerVersion!.version);
            return new Version(managerVersion!.version);
        }
        finally {
            await ds.destroy();
        }
    }
    private async executeCmd(cmd: string): Promise<string> {
        this.log("Manager.executeCmd() - " + cmd);

        const ret: string = await new Promise((resolve, reject) => {
            child_process.exec(cmd, (error, stdout, stderr) => {
                if (error)
                    reject(error);
                if (stderr)
                    reject(new Error(stderr));

                resolve(stdout);
            });
        });
        return ret;
    }
}