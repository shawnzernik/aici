import { QdrantClient } from "@qdrant/js-client-rest";
import { UUIDv4 } from "common/src/tre/logic/UUIDv4";
import { Config } from "../../Config";
import { ApiLogic } from "./ApiLogic";
import { EntitiesDataSource } from "../../tre/data/EntitiesDataSource";
import { EmbeddingListDto } from "../models/EmbeddingListDto";

export class VectorLogic {

    public static async search(ds: EntitiesDataSource, collection: string, content: string, limit: number): Promise<any> {
        const embeddingResponse: EmbeddingListDto = await ApiLogic.getEmbedding(ds, content);
        const embeddingVector = embeddingResponse.data[0].embedding;

        const qdrantClient = new QdrantClient({
            url: Config.qdrantUrl
        });

        const searchResponse = await qdrantClient.search(
            collection,
            {
                vector: embeddingVector,
                limit: limit
            }
        );
        return searchResponse;
    }

    public static async deleteAndCreateCollections(qdrantClient: QdrantClient, name: string) {
        let collections = await qdrantClient.getCollections();
        let collectionExists = collections.collections.some((pred) => { return pred.name === name });
        if (collectionExists)
            await qdrantClient.deleteCollection(name);

        await qdrantClient.createCollection(
            name,
            {
                vectors: {
                    size: Config.qdrantVectorSize,
                    distance: "Cosine"
                }
            }
        );
    }

    public static async saveToVectorDb(qdrantClient: QdrantClient, collection: string, embeddingResponse: EmbeddingListDto, fileName: string, fileContents: string) {
        await qdrantClient.upsert(
            collection,
            {
                wait: true,
                points: [
                    {
                        id: UUIDv4.generate(),
                        vector: embeddingResponse.data[0].embedding,
                        payload: {
                            title: fileName,
                            content: fileContents,
                            promptTokens: embeddingResponse.usage.prompt_tokens,
                            totalTokens: embeddingResponse.usage.total_tokens
                        }
                    }
                ]
            }
        );
    }

}