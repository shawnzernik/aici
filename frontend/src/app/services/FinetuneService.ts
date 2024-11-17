import { FinetuneDto } from "common/src/app/models/FinetuneDto";
import { FetchWrapper } from "../../tre/services/FetchWrapper";
import { UUIDv4 } from "common/src/tre/logic/UUIDv4";

export class FinetuneService {
    public static async get(token: string, guid: string): Promise<FinetuneDto> {
        const ret = await FetchWrapper.get<FinetuneDto>({
            url: "/api/v0/finetune/" + guid,
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    public static async list(token: string): Promise<FinetuneDto[]> {
        const ret = await FetchWrapper.get<FinetuneDto[]>({
            url: "/api/v0/finetunes",
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    public static async save(token: string, dto: FinetuneDto): Promise<void> {
        await FetchWrapper.post({
            url: "/api/v0/finetune",
            body: dto,
            corelation: UUIDv4.generate(),
            token: token
        });
    }

    public static async delete(token: string, guid: string): Promise<void> {
        await FetchWrapper.delete({
            url: "/api/v0/finetune/" + guid,
            corelation: UUIDv4.generate(),
            token: token
        });
    }
}