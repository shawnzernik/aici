import { DataSource, Repository } from "typeorm";
import { ListEntity } from "./ListEntity";

export class ListRepository extends Repository<ListEntity> {
    public constructor(ds: DataSource) {
        super(ListEntity, ds.createEntityManager(), ds.createQueryRunner());
    }
}