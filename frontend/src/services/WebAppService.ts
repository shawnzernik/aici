import { Stats } from "../models/Stats";

export class WebAppService {
    public static async list(): Promise<Stats> {
        const response = await fetch("/health/stats", { method: "GET" });
        if(!response.ok)
            throw new Error(response.statusText);

        const ret = await response.json() as Stats;
        return ret;
    }
}