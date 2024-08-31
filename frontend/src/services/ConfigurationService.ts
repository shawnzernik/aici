import { Configuration } from "../models/Configuration";

export class ConfigurationService {
    public static async load(): Promise<Configuration> {
        const response = await fetch("/api/v0/config", { method: "GET" });
        if (!response.ok) {
            const detail = await response.json();
            if (detail["detail"])
                throw new Error(detail["detail"])
            else
                throw new Error(response.statusText);
        }

        const ret = await response.json() as string;
        return JSON.parse(ret) as Configuration;
    }
    public static async save(contents: Configuration): Promise<void> {
        const response = await fetch(
            "/api/v0/config",
            { method: "PUT", body: JSON.stringify(contents) }
        );
        if (!response.ok) {
            const detail = await response.json();
            if (detail["detail"])
                throw new Error(detail["detail"])
            else
                throw new Error(response.statusText);
        }
    }

}