import { DataSource, Repository } from "typeorm";
import { PermissionEntity } from "./PermissionEntity";

export class PermissionRepository extends Repository<PermissionEntity> {
    public constructor(ds: DataSource) {
        super(PermissionEntity, ds.createEntityManager(), ds.createQueryRunner());
    }
}