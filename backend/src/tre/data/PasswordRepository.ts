import { DataSource, Repository } from "typeorm";
import { PasswordEntity } from "./PasswordEntity";

export class PasswordRepository extends Repository<PasswordEntity> {
    public constructor(ds: DataSource) {
        super(PasswordEntity, ds.createEntityManager(), ds.createQueryRunner());
    }
}