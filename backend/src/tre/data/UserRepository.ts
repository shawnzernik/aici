import { DataSource, Repository } from "typeorm";
import { UserEntity } from "./UserEntity";

export class UserRepository extends Repository<UserEntity> {
    public constructor(ds: DataSource) {
        super(UserEntity, ds.createEntityManager(), ds.createQueryRunner());
    }
}
