import { DatasetDto } from "common/src/app/models/DatasetDto";
import { FetchWrapper } from "../../tre/services/FetchWrapper";
import { UUIDv4 } from "common/src/tre/logic/UUIDv4";

/**
 * Service for managing datasets.
 */
export class DatasetService {
    /**
     * Retrieves a dataset by its GUID.
     * @param token - The authentication token.
     * @param guid - The GUID of the dataset.
     * @returns The dataset DTO.
     */
    public static async get(token: string, guid: string): Promise<DatasetDto> {
        const ret = await FetchWrapper.get<DatasetDto>({
            url: "/api/v0/dataset/" + guid,
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    /**
     * Retrieves a list of datasets.
     * @param token - The authentication token.
     * @returns An array of dataset DTOs.
     */
    public static async list(token: string): Promise<DatasetDto[]> {
        const ret = await FetchWrapper.get<DatasetDto[]>({
            url: "/api/v0/datasets",
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    /**
     * Saves a dataset.
     * @param token - The authentication token.
     * @param dto - The dataset DTO to save.
     * @returns void
     */
    public static async save(token: string, dto: DatasetDto): Promise<void> {
        await FetchWrapper.post({
            url: "/api/v0/dataset",
            body: dto,
            corelation: UUIDv4.generate(),
            token: token
        });
    }

    /**
     * Deletes a dataset by its GUID.
     * @param token - The authentication token.
     * @param guid - The GUID of the dataset.
     * @returns void
     */
    public static async delete(token: string, guid: string): Promise<void> {
        await FetchWrapper.delete({
            url: "/api/v0/dataset/" + guid,
            corelation: UUIDv4.generate(),
            token: token
        });
    }
}
