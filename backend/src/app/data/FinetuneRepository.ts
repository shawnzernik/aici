import { DataSource, Repository } from "typeorm";
import { FinetuneEntity } from "./FinetuneEntity";

export class FinetuneRepository extends Repository<FinetuneEntity> {
    public constructor(ds: DataSource) {
        super(FinetuneEntity, ds.createEntityManager(), ds.createQueryRunner());
    }
}