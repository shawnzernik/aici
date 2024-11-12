import { DataSource, Repository } from "typeorm";
import { MembershipEntity } from "./MembershipEntity";

export class MembershipRepository extends Repository<MembershipEntity> {
    public constructor(ds: DataSource) {
        super(MembershipEntity, ds.createEntityManager(), ds.createQueryRunner());
    }
}