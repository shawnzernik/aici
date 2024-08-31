import { Stats } from "../models/Stats";

export class WebAppService {
    public static async list(): Promise<Stats> {
        const response = await fetch("/health/stats", { method: "GET" });
        if (!response.ok) {
            const detail = await response.json();
            if (detail["detail"])
                throw new Error(detail["detail"])
            else
                throw new Error(response.statusText);
        }

        const ret = await response.json() as Stats;
        return ret;
    }
}