import { Message } from "../models/Message";
import { Response } from "../models/Response";
import { Stats } from "../models/Stats";

export class ChatService {
    public static async send(messages: Message[]): Promise<Response> {
        const response = await fetch(
            "/api/v0/chat",
            { method: "POST", body: JSON.stringify(messages) }
        );

        let ret: Response = await response.json() as Response;

        if (!response.ok) {
            let error = "HTTP Status " + response.status + " - " + response.statusText + "\n";
            error += "\n```json\n"
            error += JSON.stringify(ret, null, 4);
            error += "\n```\n"

            ret = {
                inputTokens: 0,
                outputTokens: 0,
                seconds: 0,
                message: {
                    role: "system",
                    content: error
                }
            }
        }

        console.log(ret);

        return ret;
    }
    public static async reload(): Promise<void> {
        const response = await fetch("/api/v0/reload", { method: "GET" });
        if(!response.ok)
            throw new Error(response.statusText);
    }    
    public static async train(): Promise<void> {
        const response = await fetch("/api/v0/train", { method: "GET" });
        if(!response.ok)
            throw new Error(response.statusText);
    }    
    public static async pushToHub(): Promise<void> {
        const response = await fetch("/api/v0/push", { method: "GET" });
        if(!response.ok)
            throw new Error(response.statusText);
    }    

}