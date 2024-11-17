import { Message } from "common/src/app/models/Message";
import { EntitiesDataSource } from "../../app/data/EntitiesDataSource";
import { DatasetRepository } from "../data/DatasetRepository";

export class DatasetLogic {
    public static async createDataset(ds: EntitiesDataSource): Promise<string> {
        const dataset = await new DatasetRepository(ds).findBy({ includeInTraining: true });

        let ret = "";

        for (let data of dataset) {
            const messages: Message[] = JSON.parse(data.json);
            const cleanMessages: Message[] = [];
            for (let msg of messages) {
                cleanMessages.push({
                    role: msg.role,
                    content: msg.content
                });
            }

            ret += JSON.stringify({ messages: cleanMessages }) + "\n";
        }

        return ret;
    }

}