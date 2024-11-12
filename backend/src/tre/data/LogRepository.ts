import { DataSource, Repository } from "typeorm";
import { LogEntity } from "./LogEntity";

export class LogRepository extends Repository<LogEntity> {
    public constructor(ds: DataSource) {
        super(LogEntity, ds.createEntityManager(), ds.createQueryRunner());
    }
}
