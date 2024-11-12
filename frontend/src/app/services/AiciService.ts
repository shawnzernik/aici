import { Response as AiciResponse } from "common/src/app/models/Response";
import { Message as AiciMessage } from "common/src/app/models/Message";
import { File as AiciFile } from "common/src/app/models/File";
import { UUIDv4 } from "common/src/tre/logic/UUIDv4";
import { LogDto } from "common/src/tre/models/LogDto";
import { FetchWrapper } from "../../tre/services/FetchWrapper";

export class AiciService {
    public static async chat(token: string, messages: AiciMessage[]): Promise<AiciResponse> {
        const ret = await FetchWrapper.post<AiciResponse>({
            url: "/api/v0/aici/chat",
            body: messages,
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

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

    public static async save(token: string, name: string, contents: string): Promise<void> {
        const obj: AiciFile = {
            file: name,
            contents: contents
        };

        const corelation = UUIDv4.generate();
        await FetchWrapper.post<AiciResponse>({
            url: "/api/v0/aici/save",
            body: obj,
            corelation: corelation,
            token: token
        });
    }

    private static async readFile(f: File): Promise<ArrayBuffer> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                resolve(ev.target.result as ArrayBuffer);
            };
            reader.readAsArrayBuffer(f);
        });
    }

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

    public static async uploadLogs(token: string, corelation: string): Promise<LogDto[]> {
        const ret = await FetchWrapper.get<LogDto[]>({
            url: "/api/v0/aici/upload/" + corelation,
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }
}