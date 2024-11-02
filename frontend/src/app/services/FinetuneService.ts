import { FinetuneDto } from "common/src/app/models/FinetuneDto";
import { FetchWrapper } from "../../tre/services/FetchWrapper";
import { UUIDv4 } from "common/src/tre/logic/UUIDv4";

/**
 * Service class for handling operations related to fine-tuning.
 */
export class FinetuneService {
    /**
     * Retrieves a specific fine-tune configuration by its GUID.
     * @param token - Authentication token.
     * @param guid - The unique identifier of the fine-tune configuration.
     * @returns A promise that resolves to a FinetuneDto object.
     */
    public static async get(token: string, guid: string): Promise<FinetuneDto> {
        const ret = await FetchWrapper.get<FinetuneDto>({
            url: "/api/v0/finetune/" + guid,
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    /**
     * Retrieves a list of all fine-tune configurations.
     * @param token - Authentication token.
     * @returns A promise that resolves to an array of FinetuneDto objects.
     */
    public static async list(token: string): Promise<FinetuneDto[]> {
        const ret = await FetchWrapper.get<FinetuneDto[]>({
            url: "/api/v0/finetunes",
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    /**
     * Saves a new or updated fine-tune configuration.
     * @param token - Authentication token.
     * @param dto - The FinetuneDto object to be saved.
     * @returns A promise that resolves when the save operation is complete.
     */
    public static async save(token: string, dto: FinetuneDto): Promise<void> {
        await FetchWrapper.post({
            url: "/api/v0/finetune",
            body: dto,
            corelation: UUIDv4.generate(),
            token: token
        });
    }

    /**
     * Deletes a specific fine-tune configuration by its GUID.
     * @param token - Authentication token.
     * @param guid - The unique identifier of the fine-tune configuration to be deleted.
     * @returns A promise that resolves when the delete operation is complete.
     */
    public static async delete(token: string, guid: string): Promise<void> {
        await FetchWrapper.delete({
            url: "/api/v0/finetune/" + guid,
            corelation: UUIDv4.generate(),
            token: token
        });
    }
}
