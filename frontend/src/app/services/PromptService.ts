import { PromptDto } from "common/src/app/models/PromptDto";
import { FetchWrapper } from "../../tre/services/FetchWrapper";
import { UUIDv4 } from "common/src/tre/logic/UUIDv4";

export class PromptService {
    public static async get(token: string, guid: string): Promise<PromptDto> {
        const ret = await FetchWrapper.get<PromptDto>({
            url: "/api/v0/prompt/" + guid,
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    public static async list(token: string): Promise<PromptDto[]> {
        const ret = await FetchWrapper.get<PromptDto[]>({
            url: "/api/v0/prompts",
            corelation: UUIDv4.generate(),
            token: token
        });
        return ret;
    }

    public static async save(token: string, dto: PromptDto): Promise<void> {
        await FetchWrapper.post({
            url: "/api/v0/prompt",
            body: dto,
            corelation: UUIDv4.generate(),
            token: token
        });
    }

    public static async delete(token: string, guid: string): Promise<void> {
        await FetchWrapper.delete({
            url: "/api/v0/prompt/" + guid,
            corelation: UUIDv4.generate(),
            token: token
        });
    }
}