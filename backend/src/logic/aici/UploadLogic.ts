import fs from "fs";
import path from "path";
import AdmZip from "adm-zip";
import { QdrantClient } from "@qdrant/js-client-rest";
import { Config } from "../../Config";
import { VectorLogic } from "./VectorLogic";
import { EntitiesDataSource } from "../../data/EntitiesDataSource";
import { Logger } from "../../Logger";
import { Message } from "common/src/models/aici/Message";
import { DatasetEntity } from "../../data/DatasetEntity";
import { UUIDv4 } from "common/src/logic/UUIDv4";
import { LogEntity } from "../../data/LogEntity";
import { ApiLogic } from "./ApiLogic";
import { File as AiciFile } from "common/src/models/aici/File";
import { SettingLogic } from "../SettingLogic";

/**
 * Handles the upload and download of files for the AICI module.
 */
export class UploadLogic {
    /**
     * Retrieves upload logs based on the provided correlation string.
     * @param ds - The EntitiesDataSource instance for database access.
     * @param corelation - The correlation string to filter logs.
     * @returns An array of LogEntity objects.
     */
    public static async getUploadLogs(ds: EntitiesDataSource, corelation: string): Promise<LogEntity[]> {
        const logs = await ds.logRepository().find({ where: { corelation: corelation }, order: { epoch: "DESC", order: "DESC" } });

        logs.forEach((log) => {
            log.caller = "";
        });

        return logs;
    }

    /**
     * Downloads a file, first checking for it in local storage, then in the vector database.
     * @param logger - The logger instance for logging messages.
     * @param ds - The EntitiesDataSource instance for database access.
     * @param body - The AiciFile object containing file download information.
     * @returns The downloaded AiciFile object.
     */
    public static async download(ds: EntitiesDataSource, body: AiciFile): Promise<AiciFile> {
        if (!body.file || body.file === "undefined")
            throw new Error("You must provide a file name!");

        const file = await UploadLogic.downloadVector(ds, Config.qdrantNameCollection, body.file);
        if (file)
            return file;

        throw new Error(`Could not locate file or embedding by name '${body.file}'!`);
    }

    public static async project(ds: EntitiesDataSource, body: AiciFile): Promise<AiciFile> {
        if (!body.file || body.file === "undefined")
            throw new Error("You must provide a file name!");

        const file = await UploadLogic.downloadFile(ds, body.file);
        if (file)
            return file;

        throw new Error(`Could not locate file or embedding by name '${body.file}'!`);
    }

    /**
     * Downloads vector data for a specified file from the vector database.
     * @param ds - The EntitiesDataSource instance for database access.
     * @param collection - The name of the collection to search.
     * @param file - The name of the file to search for.
     * @returns An AiciFile object containing the file download information, or null if not found.
     */
    private static async downloadVector(ds: EntitiesDataSource, collection: string, file: string): Promise<AiciFile | null> {
        const setting = await ds.settingRepository().findByKey("Aici:Download:Confidence");
        const settingLogic = new SettingLogic(setting);

        let vector = await VectorLogic.search(ds, collection, file, 1);

        if (vector[0].score < settingLogic.integerValue())
            throw new Error(`File '${file}' not found with confidence (minimum ${settingLogic.integerValue()}; actual ${vector[0].score})!`);

        return {
            file: vector[0].payload.title,
            contents: vector[0].payload.content
        };
    }

    /**
     * Attempts to download a file from the local filesystem.
     * @param ds - The EntitiesDataSource instance for database access.
     * @param requested - The name of the requested file.
     * @returns An AiciFile object if the file exists and is accessible, or null if not found.
     */
    private static async downloadFile(ds: EntitiesDataSource, requested: string): Promise<AiciFile | null> {
        const setting = await ds.settingRepository().findByKey("Aici:Project");

        let file = requested;
        if (file.startsWith("~/"))
            file = path.join(setting.value, file.substring(2, file.length));

        file = path.resolve(file);
        const temp = path.resolve(setting.value);
        if (!file.startsWith(temp))
            return null;
        if (!fs.existsSync(file))
            return null;

        return {
            file: requested,
            contents: fs.readFileSync(file, { encoding: "utf8" })
        }
    }

    /**
     * Uploads a file, processing it for vector embeddings and saving metadata to the database.
     * @param logger - The logger instance for logging messages.
     * @param body - The AiciFile object containing file upload information.
     * @returns void
     */
    public static async upload(logger: Logger, body: AiciFile): Promise<void> {
        const ds = new EntitiesDataSource();
        await ds.initialize();
        try {
            await ds.datasetRepository().createQueryBuilder().delete()
                .from("datasets")
                .where("is_uploaded = TRUE")
                .execute();

            const qdrantClient = new QdrantClient({
                url: Config.qdrantUrl
            });

            await VectorLogic.deleteAndCreateCollections(qdrantClient, Config.qdrantContentCollection);
            await VectorLogic.deleteAndCreateCollections(qdrantClient, Config.qdrantExplanationCollection);
            await VectorLogic.deleteAndCreateCollections(qdrantClient, Config.qdrantNameCollection);

            const uploadedFile = this.saveUpload(body, "zip");
            const extractedZipFolder = await this.extractZip(uploadedFile);

            const includeSettingDto = await ds.settingRepository().findByKey("Aici:Upload:Include");
            const includeRexExes = this.createRegExes(includeSettingDto.value);

            const excludeSettingDto = await ds.settingRepository().findByKey("Aici:Upload:Exclude");
            const excludeRegExes = this.createRegExes(excludeSettingDto.value);

            const files = this.getFiles(logger, extractedZipFolder, includeRexExes, excludeRegExes);
            const errors: string[] = [];
            let promises: Promise<void>[] = [];
            let resolved = 0;
            files.forEach((file, cnt) => {
                promises.push(new Promise(async (resolve) => {
                    const fileName = path.join("~", file);
                    try {
                        await logger.log(`Aici.upload() - ${cnt + 1} of ${files.length} - ${file}`);

                        const fileContents = fs.readFileSync(path.join(extractedZipFolder, file), { encoding: "utf8" });

                        const messages: Message[] = await ApiLogic.getExplanation(cnt + 1, files.length, logger, ds, fileName, fileContents);
                        await this.saveMessagesToDataset(ds, fileName, messages);

                        let embeddingResponse;
                        if (fileContents.length / Config.embeddingBytesPerToken > Config.embeddingMaxTokens)
                            errors.push(`Aici.upload() - ${cnt + 1} of ${files.length} - ${fileName} - content.tokens > ${Config.embeddingMaxTokens}`);
                        if (fileContents.length / Config.embeddingBytesPerToken > Config.embeddingMaxTokens)
                            errors.push(`Aici.upload() - ${cnt + 1} of ${files.length} - ${fileName} - explanation.tokens > ${Config.embeddingMaxTokens}`);

                        if (!(
                            fileContents.length / Config.embeddingBytesPerToken > Config.embeddingMaxTokens
                            || fileContents.length / Config.embeddingBytesPerToken > Config.embeddingMaxTokens
                        )) {
                            try {
                                embeddingResponse = await ApiLogic.getEmbedding(ds, fileName);
                                await VectorLogic.saveToVectorDb(qdrantClient, Config.qdrantNameCollection, embeddingResponse, fileName, fileContents);
                            }
                            catch (err) {
                                errors.push(`Aici.upload() - ${cnt + 1} of ${files.length} - ${fileName} - name ERROR: ${(err as Error).message}`);
                            }

                            try {
                                embeddingResponse = await ApiLogic.getEmbedding(ds, fileContents);
                                await VectorLogic.saveToVectorDb(qdrantClient, Config.qdrantContentCollection, embeddingResponse, fileName, fileContents);
                            }
                            catch (err) {
                                errors.push(`Aici.upload() - ${cnt + 1} of ${files.length} - ${fileName} - content ERROR: ${(err as Error).message}`);
                            }

                            try {
                                const explanation = messages[messages.length - 1].content;
                                embeddingResponse = await ApiLogic.getEmbedding(ds, explanation);
                                await VectorLogic.saveToVectorDb(qdrantClient, Config.qdrantExplanationCollection, embeddingResponse, fileName, explanation);
                            }
                            catch (err) {
                                errors.push(`Aici.upload() - ${cnt + 1} of ${files.length} - ${fileName} - explanation ERROR: ${(err as Error).message}`);
                            }
                        }

                        await logger.log(`Aici.upload() - COMPLETED ${resolved + 1} of ${files.length}`);
                        resolved += 1;
                        resolve();
                    }
                    catch (err) {
                        errors.push(`Aici.upload() - ${cnt + 1} of ${files.length} - ${fileName} - ERROR: ${(err as Error).message}`);
                        resolve();
                    }
                }));
            });
            await Promise.all(promises);

            for (let cnt = 0; cnt < errors.length; cnt++)
                await logger.error(errors[cnt]);

            await logger.log("ALL DONE!");
        }
        finally {
            await ds.destroy();
        }
    }

    /**
     * Saves an uploaded file to the local filesystem.
     * @param upload - The AiciFile object containing file upload information.
     * @param extension - The expected file extension.
     * @returns The path to the saved file.
     */
    private static saveUpload(upload: AiciFile, extension: string | undefined): string {
        if (!fs.existsSync(Config.tempDirectory))
            fs.mkdirSync(Config.tempDirectory, { recursive: true });

        const fileName = upload.file;
        const contents = upload.contents;
        if (!fileName || !contents)
            throw new Error("File and/or contents is empty!");

        if (extension && !fileName.toLowerCase().endsWith("." + extension.toLowerCase()))
            throw new Error("File name does not have needed " + extension + " extension!");

        const targetFile = path.join(Config.tempDirectory, fileName);
        if (fs.existsSync(targetFile))
            fs.rmSync(targetFile, { recursive: true, force: true });

        const buffer = Buffer.from(contents, "base64");
        fs.writeFileSync(targetFile, buffer);

        return targetFile;
    }

    /**
     * Extracts a ZIP file into a specified directory.
     * @param zipFileName - The name of the ZIP file to extract.
     * @returns The path to the extracted folder.
     */
    private static async extractZip(zipFileName: string): Promise<string> {
        let uploadFolder = path.join(Config.tempDirectory, zipFileName.replace(path.extname(zipFileName), ""));
        if (fs.existsSync(uploadFolder))
            fs.rmSync(uploadFolder, { recursive: true, force: true });
        fs.mkdirSync(uploadFolder, { recursive: true });

        const ret = uploadFolder;

        uploadFolder = Config.tempDirectory;
        return new Promise((resolve, reject) => {
            const zip = new AdmZip(zipFileName);
            zip.extractAllToAsync(uploadFolder, true, false, () => {
                resolve(uploadFolder);
            });
        });
    }

    /**
     * Gets a list of files in a directory that match include/exclude patterns.
     * @param logger - The logger instance for logging messages.
     * @param base - The base directory to search for files.
     * @param includeRexExes - An array of regexes for including files.
     * @param excludeRexExes - An array of regexes for excluding files.
     * @returns An array of file names that match the include/exclude criteria.
     */
    private static getFiles(logger: Logger, base: string, includeRexExes: RegExp[], excludeRexExes: RegExp[]): string[] {
        const ret: string[] = [];

        const files = fs.readdirSync(base, { recursive: true, encoding: "utf8" });
        files.sort();

        files.forEach((name: string) => {
            let include = false;
            includeRexExes.forEach((regex) => {
                include = include || regex.test(name.toLowerCase());
            });
            if (!include) {
                logger.log("(-) " + name);
                return;
            }

            let exclude = false;
            excludeRexExes.forEach((regex) => {
                exclude = exclude || regex.test(name.toLowerCase());
            });
            if (exclude) {
                logger.log("(-) " + name);
                return;
            }

            logger.log("(+) " + name);
            ret.push(name);
        });

        return ret;
    }

    /**
     * Saves messages to a dataset in the database.
     * @param ds - The EntitiesDataSource instance for database access.
     * @param fileName - The name of the file associated with the messages.
     * @param messages - An array of messages to save.
     * @returns void
     */
    private static async saveMessagesToDataset(ds: EntitiesDataSource, fileName: string, messages: Message[]) {
        let dataset = await ds.datasetRepository().findOneBy({ title: fileName });
        if (!dataset) {
            dataset = new DatasetEntity();
            dataset.guid = UUIDv4.generate();
            dataset.title = fileName;
            dataset.includeInTraining = true;
        }
        dataset.json = JSON.stringify(messages);

        await ds.datasetRepository().save(dataset);
    }

    /**
     * Creates an array of regexes from a newline-separated list.
     * @param newlineSepList - A string of regex patterns separated by newlines.
     * @returns An array of regexes.
     */
    private static createRegExes(newlineSepList: string): RegExp[] {
        let strs = newlineSepList.trim().split("\n");

        let regexes: RegExp[] = [];
        strs.forEach((str) => {
            const trimmed = str.trim();
            regexes.push(new RegExp(trimmed));
        });

        return regexes;
    }
}
