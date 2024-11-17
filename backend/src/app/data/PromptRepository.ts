import { DataSource, Repository } from "typeorm";
import { PromptEntity } from "./PromptEntity";

export class PromptRepository extends Repository<PromptEntity> {
    public constructor(ds: DataSource) {
        super(PromptEntity, ds.createEntityManager(), ds.createQueryRunner());
    }
}
