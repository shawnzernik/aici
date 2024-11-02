import { UUIDv4 } from "common/src/tre/logic/UUIDv4";
import { Config } from "../Config";
import { EntitiesDataSource } from "./data/EntitiesDataSource";
import { LogRepository } from "./data/LogRepository";

export type LogLevels = "trace" | "log" | "warn" | "error" | "none" | "always";

interface LogEntry {
    level: string;
    msg?: any;
    caller?: string;
}

export class Logger {
    private ansi_reset(text: string): string { return `\x1b[0m${text}\x1b[0m`; }
    private ansi_black(text: string): string { return `\x1b[30m${text}\x1b[0m`; }
    private ansi_red(text: string): string { return `\x1b[31m${text}\x1b[0m`; }
    private ansi_green(text: string): string { return `\x1b[32m${text}\x1b[0m`; }
    private ansi_yellow(text: string): string { return `\x1b[33m${text}\x1b[0m`; }
    private ansi_blue(text: string): string { return `\x1b[34m${text}\x1b[0m`; }
    private ansi_magenta(text: string): string { return `\x1b[35m${text}\x1b[0m`; }
    private ansi_cyan(text: string): string { return `\x1b[36m${text}\x1b[0m`; }
    private ansi_white(text: string): string { return `\x1b[37m${text}\x1b[0m`; }
    private ansi_brightBlack(text: string): string { return `\x1b[90m${text}\x1b[0m`; }
    private ansi_brightRed(text: string): string { return `\x1b[91m${text}\x1b[0m`; }
    private ansi_brightGreen(text: string): string { return `\x1b[92m${text}\x1b[0m`; }
    private ansi_brightYellow(text: string): string { return `\x1b[93m${text}\x1b[0m`; }
    private ansi_brightBlue(text: string): string { return `\x1b[94m${text}\x1b[0m`; }
    private ansi_brightMagenta(text: string): string { return `\x1b[95m${text}\x1b[0m`; }
    private ansi_brightCyan(text: string): string { return `\x1b[96m${text}\x1b[0m`; }
    private ansi_brightWhite(text: string): string { return `\x1b[97m${text}\x1b[0m`; }
    private ansi_bgBlack(text: string): string { return `\x1b[40m${text}\x1b[0m`; }
    private ansi_bgRed(text: string): string { return `\x1b[41m${text}\x1b[0m`; }
    private ansi_bgGreen(text: string): string { return `\x1b[42m${text}\x1b[0m`; }
    private ansi_bgYellow(text: string): string { return `\x1b[43m${text}\x1b[0m`; }
    private ansi_bgBlue(text: string): string { return `\x1b[44m${text}\x1b[0m`; }
    private ansi_bgMagenta(text: string): string { return `\x1b[45m${text}\x1b[0m`; }
    private ansi_bgCyan(text: string): string { return `\x1b[46m${text}\x1b[0m`; }
    private ansi_bgWhite(text: string): string { return `\x1b[47m${text}\x1b[0m`; }
    private ansi_bgBrightBlack(text: string): string { return `\x1b[100m${text}\x1b[0m`; }
    private ansi_bgBrightRed(text: string): string { return `\x1b[101m${text}\x1b[0m`; }
    private ansi_bgBrightGreen(text: string): string { return `\x1b[102m${text}\x1b[0m`; }
    private ansi_bgBrightYellow(text: string): string { return `\x1b[103m${text}\x1b[0m`; }
    private ansi_bgBrightBlue(text: string): string { return `\x1b[104m${text}\x1b[0m`; }
    private ansi_bgBrightMagenta(text: string): string { return `\x1b[105m${text}\x1b[0m`; }
    private ansi_bgBrightCyan(text: string): string { return `\x1b[106m${text}\x1b[0m`; }
    private ansi_bgBrightWhite(text: string): string { return `\x1b[107m${text}\x1b[0m`; }
    private ansi_bold(text: string): string { return `\x1b[1m${text}\x1b[0m`; }
    private ansi_dim(text: string): string { return `\x1b[2m${text}\x1b[0m`; }
    private ansi_italic(text: string): string { return `\x1b[3m${text}\x1b[0m`; }
    private ansi_underline(text: string): string { return `\x1b[4m${text}\x1b[0m`; }
    private ansi_blink(text: string): string { return `\x1b[5m${text}\x1b[0m`; }
    private ansi_inverse(text: string): string { return `\x1b[7m${text}\x1b[0m`; }
    private ansi_hidden(text: string): string { return `\x1b[8m${text}\x1b[0m`; }
    private ansi_strikethrough(text: string): string { return `\x1b[9m${text}\x1b[0m`; }

    private static LEVELS = { "trace": 4, "log": 3, "warn": 2, "error": 1, "none": 0, "always": 0 }
    private corelation: string;
    private static ds?: EntitiesDataSource;

    public constructor(corelation: string) {
        Config.logIndent = Config.logIndent;
        this.corelation = corelation === "u" ? UUIDv4.generate() : corelation;
    }

    private async output(entry: LogEntry) {
        if (!Logger.ds) { Logger.ds = new EntitiesDataSource(); await Logger.ds.initialize(); }
        const epoch = JSON.stringify(new Date(Date.now()).toISOString());
        const logRepo = new LogRepository(Logger.ds);

        if (entry.msg instanceof Error)
            await logRepo.save([{ guid: UUIDv4.generate(), corelation: this.corelation, epoch, level: entry.level, caller: entry.caller, message: entry.msg.message }]);
        else
            await logRepo.save([{ guid: UUIDv4.generate(), corelation: this.corelation, epoch, level: entry.level, caller: entry.caller, message: entry.msg }]);

        if (!entry.msg)
            return;
        let out = `${this.ansi_white("{")}${this.ansi_blue(" epoch")}${this.ansi_white(": ")}${this.ansi_red(epoch)}${this.ansi_blue(" corelation")}${this.ansi_white(": ")}${this.ansi_red(JSON.stringify(this.corelation, null, Config.logIndent))}`;

        if (entry.level)
            out += `${this.ansi_blue(" level")}${this.ansi_white(": ")}${this.ansi_red(JSON.stringify(entry.level, null, Config.logIndent))}`;

        if (entry.msg instanceof Error)
            out += `${this.ansi_blue(", message")}${this.ansi_white(": ")}${this.ansi_red(JSON.stringify(entry.msg.message, null, Config.logIndent))}`;
        else
            out += `${this.ansi_blue(", message")}${this.ansi_white(": ")}${this.ansi_red(JSON.stringify(entry.msg, null, Config.logIndent))}`;

        out += this.ansi_white(" }");

        console.log(out);
    }

    private getStackTraceCaller(): string { return new Error().stack || ""; }

    public async always(msg: any) {
        if (Logger.LEVELS[Config.logLevel] >= Logger.LEVELS["none"]) {
            await this.output({ level: "ALL", msg, caller: this.getStackTraceCaller() });
        }
    }

    public async trace() {
        if (Logger.LEVELS[Config.logLevel] >= Logger.LEVELS["trace"]) {
            await this.output({ level: "TRC", caller: this.getStackTraceCaller() });
        }
    }

    public async log(msg: any) {
        if (Logger.LEVELS[Config.logLevel] >= Logger.LEVELS["log"]) {
            await this.output({ level: "LOG", msg, caller: this.getStackTraceCaller() });
        }
    }

    public async error(msg: any) {
        if (Logger.LEVELS[Config.logLevel] >= Logger.LEVELS["error"]) {
            await this.output({ level: "ERR", msg, caller: this.getStackTraceCaller() });
        }
    }

    public async warn(msg: any) {
        if (Logger.LEVELS[Config.logLevel] >= Logger.LEVELS["warn"]) {
            await this.output({ level: "WRN", msg, caller: this.getStackTraceCaller() });
        }
    }
}