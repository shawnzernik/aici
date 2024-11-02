import { Message } from "common/src/app/models/Message";
import { Response } from "common/src/app/models/Response";
import { FinetuneDto } from "common/src/app/models/FinetuneDto";
import { Config } from "../../Config";
import { EntitiesDataSource } from "../../tre/data/EntitiesDataSource";
import { EmbeddingListDto } from "../models/EmbeddingListDto";
import { EmbeddingRequestDto } from "../models/EmbeddingRequestDto";
import { Logger } from "../../tre/Logger";
import { SettingRepository } from "../../tre/data/SettingRepository";

/**
 * ApiLogic class handles the business logic for the AI communication interface.
 */
export class ApiLogic {

    /**
     * Triggers a fine-tuning job with the specified parameters.
     * @param ds The data source to access repositories.
     * @param requestDto The request data transfer object containing fine-tuning parameters.
     * @returns The ID of the initiated fine-tuning job.
     */
    public static async finetune(ds: EntitiesDataSource, requestDto: FinetuneDto): Promise<string> {
        const modelSetting = await new SettingRepository(ds).findByKey("Aici:Finetune:Model");
        const urlSetting = await new SettingRepository(ds).findByKey("Aici:URL");
        const apiKeySetting = await new SettingRepository(ds).findByKey("Aici:API Key");

        const fetchResponse = await fetch(`${urlSetting.value}/v1/fine_tuning/jobs`, {
            method: "POST",
            body: JSON.stringify({
                training_file: requestDto.trainingFile,
                validation_file: requestDto.validationFile ? requestDto.validationFile : null,
                model: requestDto.model,
                suffix: requestDto.suffix,
                hyperparameters: {
                    batch_size: requestDto.batchSize,
                    learning_rate_multiplier: requestDto.learningRateMultiplier,
                    n_epochs: requestDto.epochs,
                }
            }),
            headers: {
                "Authorization": `Bearer ${apiKeySetting.value}`,
                "Content-Type": "application/json"
            }
        });
        if (!fetchResponse.ok) {
            const details = await fetchResponse.text();
            throw new Error(`HTTP Status ${fetchResponse.status} - ${fetchResponse.statusText} - ${details}`);
        }

        const data = await fetchResponse.json();
        return data.id;
    }

    /**
     * Uploads a dataset to the API for fine-tuning.
     * @param ds The data source to access repositories.
     * @param dataset The dataset in string format to be uploaded.
     * @returns The ID of the uploaded dataset.
     */
    public static async finetuneUpload(ds: EntitiesDataSource, dataset: string): Promise<string> {
        const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
        const body = `--${boundary}\r\n` +
            `Content-Disposition: form-data; name="purpose"\r\n` +
            `\r\n` +
            `fine-tune\r\n` +
            `--${boundary}\r\n` +
            `Content-Disposition: form-data; name="file"; filename="dataset.jsonl"\r\n` +
            `Content-Type: application/json\r\n` +
            `\r\n` +
            `${dataset}\r\n` +
            `--${boundary}--\r\n`;

        const urlSetting = await new SettingRepository(ds).findByKey("Aici:URL");
        const apiKeySetting = await new SettingRepository(ds).findByKey("Aici:API Key");

        const fetchResponse = await fetch(`${urlSetting.value}/v1/files`, {
            method: "POST",
            body: body,
            headers: {
                "Authorization": `Bearer ${apiKeySetting.value}`,
                "Content-Type": `multipart/form-data; boundary=${boundary}`
            }
        });

        if (!fetchResponse.ok) {
            const details = await fetchResponse.text();
            throw new Error(`HTTP Status ${fetchResponse.status} - ${fetchResponse.statusText} - ${details}`);
        }

        const data = await fetchResponse.json();
        return data.id;
    }

    /**
     * Sends a chat message to the AI and receives a response.
     * @param ds The data source to access repositories.
     * @param body An array of messages constituting the chat history.
     * @returns The response object containing AI's reply and other data.
     */
    public static async chat(ds: EntitiesDataSource, body: Message[]): Promise<Response> {
        const modelSetting = await new SettingRepository(ds).findByKey("Aici:Model");
        const urlSetting = await new SettingRepository(ds).findByKey("Aici:URL");
        const apiKeySetting = await new SettingRepository(ds).findByKey("Aici:API Key");

        const request = {
            model: modelSetting.value,
            messages: body
        };

        const fetchResponse = await fetch(`${urlSetting.value}/v1/chat/completions`, {
            method: "POST",
            body: JSON.stringify(request),
            headers: {
                "Authorization": `Bearer ${apiKeySetting.value}`,
                "Content-Type": "application/json"
            }
        });

        if (!fetchResponse.ok) {
            const details = await fetchResponse.text();
            throw new Error(`HTTP Status ${fetchResponse.status} - ${fetchResponse.statusText} - ${details}`);
        }

        const aiResponse = await fetchResponse.json();
        return aiResponse as Response;
    }

    /**
     * Retrieves an explanation for the provided file contents from the AI.
     * @param current The current index for logging purposes.
     * @param max The maximum index for logging purposes.
     * @param logger The logger instance for logging messages.
     * @param ds The data source to access repositories.
     * @param fileName The name of the file being explained.
     * @param fileContents The contents of the file being explained.
     * @returns An array of messages constituting the chat history, including the AI's explanation.
     */
    public static async getExplanation(current: number, max: number, logger: Logger, ds: EntitiesDataSource, fileName: string, fileContents: string): Promise<Message[]> {
        let userMarkdown = "Explain the file '%FILE%':\n\n```\n%CONTENT%\n```";
        userMarkdown = userMarkdown.replace("%FILE%", fileName);
        userMarkdown = userMarkdown.replace("%CONTENT%", fileContents.replace(/`/, "\\`"));

        const messages: Message[] = [{
            role: "user",
            content: userMarkdown
        }];

        const started = Date.now();
        const response = await ApiLogic.chat(ds, messages);
        const ended = Date.now();

        await logger.log(`AiciLogic.getExplanation() - ${current} of ${max} - Input: ${response.usage.prompt_tokens}; New: ${response.usage.completion_tokens}; Total: ${response.usage.total_tokens}`);
        await logger.log(`AiciLogic.getExplanation() - ${current} of ${max} - Seconds: ${(ended - started) / 1000}; T/S: ${response.usage.total_tokens / ((ended - started) / 1000)}`);

        messages.push({
            role: response.choices[0].message.role,
            content: response.choices[0].message.content
        });

        return messages;
    }

    /**
     * Retrieves embeddings for the provided content.
     * @param ds The data source to access repositories.
     * @param content The content for which to retrieve embeddings.
     * @returns The list of embeddings retrieved.
     */
    public static async getEmbedding(ds: EntitiesDataSource, content: string): Promise<EmbeddingListDto> {
        const response: EmbeddingListDto = await ApiLogic.embedding(ds, {
            model: Config.embeddingModel,
            input: content
        });
        return response;
    }

    /**
     * Private method that interfaces with the API to retrieve embeddings.
     * @param ds The data source to access repositories.
     * @param request The request object containing parameters for the embedding retrieval.
     * @returns The list of embeddings retrieved.
     */
    private static async embedding(ds: EntitiesDataSource, request: EmbeddingRequestDto): Promise<EmbeddingListDto> {
        const urlSetting = await new SettingRepository(ds).findByKey("Aici:URL");
        const apiKeySetting = await new SettingRepository(ds).findByKey("Aici:API Key");
        const fetchResponse = await fetch(`${urlSetting.value}/v1/embeddings`, {
            method: "POST",
            body: JSON.stringify(request),
            headers: {
                "Authorization": `Bearer ${apiKeySetting.value}`,
                "Content-Type": "application/json"
            }
        });

        if (!fetchResponse.ok) {
            const details = await fetchResponse.text();
            throw new Error(`HTTP Status ${fetchResponse.status} - ${fetchResponse.statusText} - ${details}`);
        }

        const aiResponse = await fetchResponse.json();
        return aiResponse as EmbeddingListDto;
    }

}
