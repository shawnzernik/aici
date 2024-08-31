import { Dataset } from "../models/Dataset";

export class DatasetsService {
    public static async list(): Promise<string[]> {
        const response = await fetch("/api/v0/datasets", { method: "GET" });
        if(!response.ok)
            throw new Error(response.statusText);

        const ret = await response.json() as string[];
        return ret;
    }
    public static async save(name: string, contents: Dataset): Promise<void> {
        const response = await fetch(
            "/api/v0/dataset/" + name,
            { method: "PUT", body: JSON.stringify(contents) }
        );

        if(response.ok)
            return;

        throw new Error(response.statusText);
    }
    public static async read(name: string): Promise<Dataset> {
        const response = await fetch("/api/v0/dataset/" + name, { method: "GET" });
        if(!response.ok)
            throw new Error(response.statusText);

        const ret = await response.json()as string;
        return JSON.parse(ret) as Dataset;
    }
    public static async delete(name: string): Promise<void> {
        const response = await fetch("/api/v0/dataset/" + name, { method: "DELETE" });
        if(!response.ok)
            throw new Error(response.statusText);
    }
}