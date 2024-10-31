import { PromptDto } from "common/src/models/PromptDto";
import { FetchWrapper } from "./FetchWrapper";
import { UUIDv4 } from "common/src/logic/UUIDv4";

/**
 * Service class to manage prompts.
 */
export class PromptService {
    /**
     * Retrieves a prompt by its GUID.
     * @param token - Authentication token.
     * @param guid - The GUID of the prompt.
     * @returns A promise that resolves to a PromptDto object.
     */
    public static async get(token: string, guid: string): Promise<PromptDto> {
        const ret = await FetchWrapper.get<PromptDto>({
            url: "/api/v0/prompt/" + guid,
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    /**
     * Retrieves a list of prompts.
     * @param token - Authentication token.
     * @returns A promise that resolves to an array of PromptDto objects.
     */
    public static async list(token: string): Promise<PromptDto[]> {
        const ret = await FetchWrapper.get<PromptDto[]>({
            url: "/api/v0/prompts",
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    /**
     * Saves a prompt.
     * @param token - Authentication token.
     * @param dto - The prompt data transfer object to save.
     * @returns A promise that resolves when the operation is complete.
     */
    public static async save(token: string, dto: PromptDto): Promise<void> {
        await FetchWrapper.post({
            url: "/api/v0/prompt",
            body: dto,
            corelation: UUIDv4.generate(),
            token: token
        });
    }

    /**
     * Deletes a prompt by its GUID.
     * @param token - Authentication token.
     * @param guid - The GUID of the prompt to delete.
     * @returns A promise that resolves when the operation is complete.
     */
    public static async delete(token: string, guid: string): Promise<void> {
        await FetchWrapper.delete({
            url: "/api/v0/prompt/" + guid,
            corelation: UUIDv4.generate(),
            token: token
        });
    }
}
