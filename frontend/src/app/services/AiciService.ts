import { Response as AiciResponse } from "common/src/app/models/Response";
import { Message as AiciMessage } from "common/src/app/models/Message";
import { File as AiciFile } from "common/src/app/models/File";
import { UUIDv4 } from "common/src/tre/logic/UUIDv4";
import { LogDto } from "common/src/tre/models/LogDto";
import { FetchWrapper } from "../../tre/services/FetchWrapper";

/**
 * Service class for interacting with the Aici API.
 */
export class AiciService {
    /**
     * Sends a chat message to the Aici API.
     * @param token - Authentication token.
     * @param messages - Array of messages to send.
     * @returns AiciResponse - Response from the Aici API.
     */
    public static async chat(token: string, messages: AiciMessage[]): Promise<AiciResponse> {
        const ret = await FetchWrapper.post<AiciResponse>({
            url: "/api/v0/aici/chat",
            body: messages,
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    /**
     * Searches for items in a specified collection.
     * @param token - Authentication token.
     * @param collection - Name of the collection to search.
     * @param similarTo - Input string for the search.
     * @param limit - Number of results to return.
     * @returns Any - Response from the search API.
     */
    public static async search(token: string, collection: string, similarTo: string, limit: number): Promise<any> {
        const ret = await FetchWrapper.post<any>({
            url: "/api/v0/aici/search/" + collection,
            body: {
                input: similarTo,
                limit: limit
            },
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    /**
     * Reads a File object and returns its contents as an ArrayBuffer.
     * @param f - File object to read.
     * @returns Promise<ArrayBuffer> - Promise that resolves with the ArrayBuffer containing the file data.
     */
    private static async readFile(f: File): Promise<ArrayBuffer> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                resolve(ev.target.result as ArrayBuffer);
            };
            reader.readAsArrayBuffer(f);
        });
    }

    /**
     * Uploads a file to the Aici API.
     * @param token - Authentication token.
     * @param file - File object to upload.
     * @returns Promise<string> - Promise that resolves with the correlation ID of the upload.
     */
    public static async upload(token: string, file: File): Promise<string> {
        const buff = await this.readFile(file);

        const uint8Array = new Uint8Array(buff);
        let binString = "";
        uint8Array.forEach((num) => {
            binString += String.fromCharCode(num);
        });
        const base64 = btoa(binString);

        const obj: AiciFile = {
            file: file.name,
            contents: base64
        };

        const corelation = UUIDv4.generate();

        await FetchWrapper.post<AiciResponse>({
            url: "/api/v0/aici/upload",
            body: obj,
            corelation: corelation,
            token: token
        });
        return corelation;
    }

    /**
     * Downloads a file from the Aici API.
     * @param token - Authentication token.
     * @param file - Name of the file to download.
     * @returns Promise<AiciFile> - Promise that resolves with the downloaded file object.
     */
    public static async download(token: string, file: string): Promise<AiciFile> {
        const obj: AiciFile = {
            file: file,
            contents: ""
        };

        const response = await FetchWrapper.post<AiciFile>({
            url: "/api/v0/aici/download",
            body: obj,
            corelation: UUIDv4.generate(),
            token: token
        });

        return response;
    }
    public static async project(token: string, file: string): Promise<AiciFile> {
        const obj: AiciFile = {
            file: file,
            contents: ""
        };

        const response = await FetchWrapper.post<AiciFile>({
            url: "/api/v0/aici/project",
            body: obj,
            corelation: UUIDv4.generate(),
            token: token
        });

        return response;
    }

    /**
     * Retrieves log entries associated with a specific correlation ID.
     * @param token - Authentication token.
     * @param corelation - Correlation ID of the upload.
     * @returns Promise<LogDto[]> - Promise that resolves with an array of log entries.
     */
    public static async uploadLogs(token: string, corelation: string): Promise<LogDto[]> {
        const ret = await FetchWrapper.get<LogDto[]>({
            url: "/api/v0/aici/upload/" + corelation,
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }
}
