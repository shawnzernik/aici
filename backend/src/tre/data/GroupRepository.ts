import { DataSource, Repository } from "typeorm";
import { GroupEntity } from "./GroupEntity";

export class GroupRepository extends Repository<GroupEntity> {
    public constructor(ds: DataSource) {
        super(GroupEntity, ds.createEntityManager(), ds.createQueryRunner());
    }
}