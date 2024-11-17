import { DatasetDto } from "common/src/app/models/DatasetDto";
import { FetchWrapper } from "../../tre/services/FetchWrapper";
import { UUIDv4 } from "common/src/tre/logic/UUIDv4";

export class DatasetService {
    public static async get(token: string, guid: string): Promise<DatasetDto> {
        const ret = await FetchWrapper.get<DatasetDto>({
            url: "/api/v0/dataset/" + guid,
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    public static async list(token: string): Promise<DatasetDto[]> {
        const ret = await FetchWrapper.get<DatasetDto[]>({
            url: "/api/v0/datasets",
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    public static async save(token: string, dto: DatasetDto): Promise<void> {
        await FetchWrapper.post({
            url: "/api/v0/dataset",
            body: dto,
            corelation: UUIDv4.generate(),
            token: token
        });
    }

    public static async delete(token: string, guid: string): Promise<void> {
        await FetchWrapper.delete({
            url: "/api/v0/dataset/" + guid,
            corelation: UUIDv4.generate(),
            token: token
        });
    }
}
