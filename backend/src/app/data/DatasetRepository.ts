import { DataSource, Repository } from "typeorm";
import { DatasetEntity } from "./DatasetEntity";

export class DatasetRepository extends Repository<DatasetEntity> {
    public constructor(ds: DataSource) {
        super(DatasetEntity, ds.createEntityManager(), ds.createQueryRunner());
    }
}