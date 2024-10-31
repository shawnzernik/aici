import { Message } from "common/src/models/aici/Message";
import { EntitiesDataSource } from "../../data/EntitiesDataSource";

/**
 * Class for handling dataset logic.
 */
export class DatasetLogic {
    /**
     * Creates a dataset from the given data source.
     * @param ds - The EntitiesDataSource to create a dataset from.
     * @returns A promise that resolves to a string containing the dataset in JSON format.
     */
    public static async createDataset(ds: EntitiesDataSource): Promise<string> {
        const dataset = await ds.datasetRepository().findBy({ includeInTraining: true });

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
