import { QdrantClient } from "@qdrant/js-client-rest";
import { UUIDv4 } from "common/src/logic/UUIDv4";
import { Config } from "../../Config";
import { EntitiesDataSource } from "../../data/EntitiesDataSource";
import { EmbeddingListDto } from "../../models/EmbeddingListDto";
import { ApiLogic } from "./ApiLogic";

/**
 * A class that handles vector logic operations such as search, collection management, and data saving to a vector database.
 */
export class VectorLogic {

    /**
     * Searches for vectors in a specified collection based on the provided content and limit.
     * @param ds - The data source used to retrieve embeddings.
     * @param collection - The name of the collection to search.
     * @param content - The content to be embedded and searched.
     * @param limit - The maximum number of results to return.
     * @returns A promise that resolves to the search response.
     */
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

    /**
     * Deletes an existing collection and creates a new one with the specified name.
     * @param qdrantClient - The Qdrant client used to manage collections.
     * @param name - The name of the collection to create.
     */
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

    /**
     * Saves embedding data to a vector database.
     * @param qdrantClient - The Qdrant client used to upsert data.
     * @param collection - The name of the collection to save data to.
     * @param embeddingResponse - The response containing embedding data.
     * @param fileName - The name of the file associated with the embeddings.
     * @param fileContents - The contents of the file associated with the embeddings.
     */
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
