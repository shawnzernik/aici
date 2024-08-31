import { Message } from "../models/Message";
import { Response } from "../models/Response";
import { Stats } from "../models/Stats";

export class ChatService {
    public static async send(messages: Message[]): Promise<Response> {
        const response = await fetch(
            "/api/v0/chat",
            { method: "POST", body: JSON.stringify(messages) }
        );

        const ret: Response = await response.json() as Response;
        if (!response.ok) {
            const detail = await response.json();
            if (detail["detail"])
                throw new Error(detail["detail"])
            else
                throw new Error(response.statusText);
        }

        return ret;
    }
    public static async reload(): Promise<void> {
        const response = await fetch("/api/v0/reload", { method: "GET" });
        if (!response.ok) {
            const detail = await response.json();
            if (detail["detail"])
                throw new Error(detail["detail"])
            else
                throw new Error(response.statusText);
        }
    }
    public static async train(): Promise<void> {
        const response = await fetch("/api/v0/train", { method: "GET" });
        if (!response.ok) {
            const detail = await response.json();
            if (detail["detail"])
                throw new Error(detail["detail"])
            else
                throw new Error(response.statusText);
        }
    }
    public static async pushToHub(): Promise<void> {
        const response = await fetch("/api/v0/push", { method: "GET" });
        if (!response.ok) {
            const detail = await response.json();
            if (detail["detail"])
                throw new Error(detail["detail"])
            else
                throw new Error(response.statusText);
        }
    }

}