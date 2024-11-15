import { DataSource, Repository } from "typeorm";
import { SecurableEntity } from "./SecurableEntity";

export class SecurableRepository extends Repository<SecurableEntity> {
    public constructor(ds: DataSource) {
        super(SecurableEntity, ds.createEntityManager(), ds.createQueryRunner());
    }
}