/**
 * Importing necessary modules for the Logger.
 */
import { UUIDv4 } from "common/src/logic/UUIDv4";
import { Config } from "./Config";
import { EntitiesDataSource } from "./data/EntitiesDataSource";

/**
 * Define the log levels available for the logger.
 */
export type LogLevels = "trace" | "log" | "warn" | "error" | "none" | "always";

/**
 * Interface representing a log entry.
 */
interface LogEntry {
    level: string;
    msg?: any;
    caller?: string;
}

/**
 * Logger class for handling application logging.
 */
export class Logger {
    /**
     * Resets ANSI formatting for the given text.
     * @param text - The text to reset formatting for.
     * @returns The text with reset ANSI formatting.
     */
    private ansi_reset(text: string): string {
        return `\x1b[0m${text}\x1b[0m`;
    }

    /**
     * Formats the given text in black ANSI color.
     * @param text - The text to format.
     * @returns The text in black ANSI color.
     */
    private ansi_black(text: string): string {
        return `\x1b[30m${text}\x1b[0m`;
    }

    /**
     * Formats the given text in red ANSI color.
     * @param text - The text to format.
     * @returns The text in red ANSI color.
     */
    private ansi_red(text: string): string {
        return `\x1b[31m${text}\x1b[0m`;
    }

    /**
     * Formats the given text in green ANSI color.
     * @param text - The text to format.
     * @returns The text in green ANSI color.
     */
    private ansi_green(text: string): string {
        return `\x1b[32m${text}\x1b[0m`;
    }

    /**
     * Formats the given text in yellow ANSI color.
     * @param text - The text to format.
     * @returns The text in yellow ANSI color.
     */
    private ansi_yellow(text: string): string {
        return `\x1b[33m${text}\x1b[0m`;
    }

    /**
     * Formats the given text in blue ANSI color.
     * @param text - The text to format.
     * @returns The text in blue ANSI color.
     */
    private ansi_blue(text: string): string {
        return `\x1b[34m${text}\x1b[0m`;
    }

    /**
     * Formats the given text in magenta ANSI color.
     * @param text - The text to format.
     * @returns The text in magenta ANSI color.
     */
    private ansi_magenta(text: string): string {
        return `\x1b[35m${text}\x1b[0m`;
    }

    /**
     * Formats the given text in cyan ANSI color.
     * @param text - The text to format.
     * @returns The text in cyan ANSI color.
     */
    private ansi_cyan(text: string): string {
        return `\x1b[36m${text}\x1b[0m`;
    }

    /**
     * Formats the given text in white ANSI color.
     * @param text - The text to format.
     * @returns The text in white ANSI color.
     */
    private ansi_white(text: string): string {
        return `\x1b[37m${text}\x1b[0m`;
    }

    /**
     * Formats the given text in bright black ANSI color.
     * @param text - The text to format.
     * @returns The text in bright black ANSI color.
     */
    private ansi_brightBlack(text: string): string {
        return `\x1b[90m${text}\x1b[0m`;
    }

    /**
     * Formats the given text in bright red ANSI color.
     * @param text - The text to format.
     * @returns The text in bright red ANSI color.
     */
    private ansi_brightRed(text: string): string {
        return `\x1b[91m${text}\x1b[0m`;
    }

    /**
     * Formats the given text in bright green ANSI color.
     * @param text - The text to format.
     * @returns The text in bright green ANSI color.
     */
    private ansi_brightGreen(text: string): string {
        return `\x1b[92m${text}\x1b[0m`;
    }

    /**
     * Formats the given text in bright yellow ANSI color.
     * @param text - The text to format.
     * @returns The text in bright yellow ANSI color.
     */
    private ansi_brightYellow(text: string): string {
        return `\x1b[93m${text}\x1b[0m`;
    }

    /**
     * Formats the given text in bright blue ANSI color.
     * @param text - The text to format.
     * @returns The text in bright blue ANSI color.
     */
    private ansi_brightBlue(text: string): string {
        return `\x1b[94m${text}\x1b[0m`;
    }

    /**
     * Formats the given text in bright magenta ANSI color.
     * @param text - The text to format.
     * @returns The text in bright magenta ANSI color.
     */
    private ansi_brightMagenta(text: string): string {
        return `\x1b[95m${text}\x1b[0m`;
    }

    /**
     * Formats the given text in bright cyan ANSI color.
     * @param text - The text to format.
     * @returns The text in bright cyan ANSI color.
     */
    private ansi_brightCyan(text: string): string {
        return `\x1b[96m${text}\x1b[0m`;
    }

    /**
     * Formats the given text in bright white ANSI color.
     * @param text - The text to format.
     * @returns The text in bright white ANSI color.
     */
    private ansi_brightWhite(text: string): string {
        return `\x1b[97m${text}\x1b[0m`;
    }

    /**
     * Formats the given text as a black background.
     * @param text - The text to format.
     * @returns The text with a black background.
     */
    private ansi_bgBlack(text: string): string {
        return `\x1b[40m${text}\x1b[0m`;
    }

    /**
     * Formats the given text as a red background.
     * @param text - The text to format.
     * @returns The text with a red background.
     */
    private ansi_bgRed(text: string): string {
        return `\x1b[41m${text}\x1b[0m`;
    }

    /**
     * Formats the given text as a green background.
     * @param text - The text to format.
     * @returns The text with a green background.
     */
    private ansi_bgGreen(text: string): string {
        return `\x1b[42m${text}\x1b[0m`;
    }

    /**
     * Formats the given text as a yellow background.
     * @param text - The text to format.
     * @returns The text with a yellow background.
     */
    private ansi_bgYellow(text: string): string {
        return `\x1b[43m${text}\x1b[0m`;
    }

    /**
     * Formats the given text as a blue background.
     * @param text - The text to format.
     * @returns The text with a blue background.
     */
    private ansi_bgBlue(text: string): string {
        return `\x1b[44m${text}\x1b[0m`;
    }

    /**
     * Formats the given text as a magenta background.
     * @param text - The text to format.
     * @returns The text with a magenta background.
     */
    private ansi_bgMagenta(text: string): string {
        return `\x1b[45m${text}\x1b[0m`;
    }

    /**
     * Formats the given text as a cyan background.
     * @param text - The text to format.
     * @returns The text with a cyan background.
     */
    private ansi_bgCyan(text: string): string {
        return `\x1b[46m${text}\x1b[0m`;
    }

    /**
     * Formats the given text as a white background.
     * @param text - The text to format.
     * @returns The text with a white background.
     */
    private ansi_bgWhite(text: string): string {
        return `\x1b[47m${text}\x1b[0m`;
    }

    /**
     * Formats the given text as a bright black background.
     * @param text - The text to format.
     * @returns The text with a bright black background.
     */
    private ansi_bgBrightBlack(text: string): string {
        return `\x1b[100m${text}\x1b[0m`;
    }

    /**
     * Formats the given text as a bright red background.
     * @param text - The text to format.
     * @returns The text with a bright red background.
     */
    private ansi_bgBrightRed(text: string): string {
        return `\x1b[101m${text}\x1b[0m`;
    }

    /**
     * Formats the given text as a bright green background.
     * @param text - The text to format.
     * @returns The text with a bright green background.
     */
    private ansi_bgBrightGreen(text: string): string {
        return `\x1b[102m${text}\x1b[0m`;
    }

    /**
     * Formats the given text as a bright yellow background.
     * @param text - The text to format.
     * @returns The text with a bright yellow background.
     */
    private ansi_bgBrightYellow(text: string): string {
        return `\x1b[103m${text}\x1b[0m`;
    }

    /**
     * Formats the given text as a bright blue background.
     * @param text - The text to format.
     * @returns The text with a bright blue background.
     */
    private ansi_bgBrightBlue(text: string): string {
        return `\x1b[104m${text}\x1b[0m`;
    }

    /**
     * Formats the given text as a bright magenta background.
     * @param text - The text to format.
     * @returns The text with a bright magenta background.
     */
    private ansi_bgBrightMagenta(text: string): string {
        return `\x1b[105m${text}\x1b[0m`;
    }

    /**
     * Formats the given text as a bright cyan background.
     * @param text - The text to format.
     * @returns The text with a bright cyan background.
     */
    private ansi_bgBrightCyan(text: string): string {
        return `\x1b[106m${text}\x1b[0m`;
    }

    /**
     * Formats the given text as a bright white background.
     * @param text - The text to format.
     * @returns The text with a bright white background.
     */
    private ansi_bgBrightWhite(text: string): string {
        return `\x1b[107m${text}\x1b[0m`;
    }

    /**
     * Formats the given text in bold.
     * @param text - The text to format.
     * @returns The text in bold.
     */
    private ansi_bold(text: string): string {
        return `\x1b[1m${text}\x1b[0m`;
    }

    /**
     * Formats the given text in dim style.
     * @param text - The text to format.
     * @returns The text in dim style.
     */
    private ansi_dim(text: string): string {
        return `\x1b[2m${text}\x1b[0m`;
    }

    /**
     * Formats the given text in italic style.
     * @param text - The text to format.
     * @returns The text in italic style.
     */
    private ansi_italic(text: string): string {
        return `\x1b[3m${text}\x1b[0m`;
    }

    /**
     * Formats the given text with an underline.
     * @param text - The text to format.
     * @returns The text with an underline.
     */
    private ansi_underline(text: string): string {
        return `\x1b[4m${text}\x1b[0m`;
    }

    /**
     * Formats the given text as blinking.
     * @param text - The text to format.
     * @returns The text as blinking.
     */
    private ansi_blink(text: string): string {
        return `\x1b[5m${text}\x1b[0m`;
    }

    /**
     * Formats the given text with inverse colors.
     * @param text - The text to format.
     * @returns The text with inverse colors.
     */
    private ansi_inverse(text: string): string {
        return `\x1b[7m${text}\x1b[0m`;
    }

    /**
     * Formats the given text as hidden.
     * @param text - The text to format.
     * @returns The text as hidden.
     */
    private ansi_hidden(text: string): string {
        return `\x1b[8m${text}\x1b[0m`;
    }

    /**
     * Formats the given text with strikethrough.
     * @param text - The text to format.
     * @returns The text with strikethrough.
     */
    private ansi_strikethrough(text: string): string {
        return `\x1b[9m${text}\x1b[0m`;
    }

    /**
     * Static object mapping log levels to their corresponding numeric values.
     */
    private static LEVELS = {
        "trace": 4,
        "log": 3,
        "warn": 2,
        "error": 1,
        "none": 0,
        "always": 0
    }

    /**
     * Correlation ID for tracking logs.
     */
    private corelation: string;

    /**
     * Static data source instance.
     */
    private static ds?: EntitiesDataSource;

    /**
     * Constructor for the Logger class.
     * @param corelation - The correlation ID or 'u' to generate a new ID.
     */
    public constructor(corelation: string) {
        Config.logIndent = Config.logIndent;

        if (corelation === "u")
            this.corelation = UUIDv4.generate();
        else
            this.corelation = corelation;
    }

    /**
     * Outputs a log entry to the console and saves it to the data source.
     * @param entry - The log entry to output.
     */
    private async output(entry: LogEntry) {
        if (!Logger.ds) {
            Logger.ds = new EntitiesDataSource();
            await Logger.ds.initialize();
        }

        const epoch = JSON.stringify(new Date(Date.now()).toISOString());

        if (entry.msg instanceof Error)
            await Logger.ds.logRepository().save([{
                guid: UUIDv4.generate(),
                corelation: this.corelation,
                epoch: epoch,
                level: entry.level,
                caller: entry.caller,
                message: entry.msg.message
            }]);
        else
            await Logger.ds.logRepository().save([{
                guid: UUIDv4.generate(),
                corelation: this.corelation,
                epoch: epoch,
                level: entry.level,
                caller: entry.caller,
                message: entry.msg
            }]);


        if (!entry.msg)
            return;

        let out = "";

        out += this.ansi_white("{");

        out += this.ansi_blue(" epoch");
        out += this.ansi_white(": ");
        out += this.ansi_red(epoch);

        out += this.ansi_blue(" corelation");
        out += this.ansi_white(": ");
        out += this.ansi_red(JSON.stringify(this.corelation, null, Config.logIndent));

        if (entry.level) {
            out += this.ansi_blue(" level");
            out += this.ansi_white(": ");
            out += this.ansi_red(JSON.stringify(entry.level, null, Config.logIndent));
        }
        if (entry.msg instanceof Error) {
            out += this.ansi_blue(", message");
            out += this.ansi_white(": ");
            out += this.ansi_red(JSON.stringify(entry.msg.message, null, Config.logIndent));
        } else {
            out += this.ansi_blue(", message");
            out += this.ansi_white(": ");
            out += this.ansi_red(JSON.stringify(entry.msg, null, Config.logIndent));
        }

        out += this.ansi_white(" }");

        console.log(out);
    }

    /**
     * Retrieves the caller's stack trace.
     * @returns The stack trace as a string.
     */
    private getStackTraceCaller(): string {
        let stack = "";

        const err = new Error();
        if (err.stack)
            stack = err.stack;

        return stack;
    }

    /**
     * Logs a message at the "always" level.
     * @param msg - The message to log.
     */
    public async always(msg: any) {
        if (Logger.LEVELS[Config.logLevel] < Logger.LEVELS["none"])
            return;

        await this.output({
            level: "ALL",
            msg: msg,
            caller: this.getStackTraceCaller()
        });
    }

    /**
     * Logs a message at the "trace" level.
     */
    public async trace() {
        if (Logger.LEVELS[Config.logLevel] < Logger.LEVELS["trace"])
            return;

        await this.output({
            level: "TRC",
            caller: this.getStackTraceCaller()
        });
    }

    /**
     * Logs a message at the "log" level.
     * @param msg - The message to log.
     */
    public async log(msg: any) {
        if (Logger.LEVELS[Config.logLevel] < Logger.LEVELS["log"])
            return;

        await this.output({
            level: "LOG",
            msg: msg,
            caller: this.getStackTraceCaller()
        });
    }

    /**
     * Logs a message at the "error" level.
     * @param msg - The message to log.
     */
    public async error(msg: any) {
        if (Logger.LEVELS[Config.logLevel] < Logger.LEVELS["error"])
            return;

        await this.output({
            level: "ERR",
            msg: msg,
            caller: this.getStackTraceCaller()
        });
    }

    /**
     * Logs a message at the "warn" level.
     * @param msg - The message to log.
     */
    public async warn(msg: any) {
        if (Logger.LEVELS[Config.logLevel] < Logger.LEVELS["warn"])
            return;

        await this.output({
            level: "WRN",
            msg: msg,
            caller: this.getStackTraceCaller()
        });
    }
}
