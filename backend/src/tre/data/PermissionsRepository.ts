import { DataSource, Repository } from 'typeorm';
import { PermissionEntity } from './PermissionEntity';

/**
 * PermissionRepository class that extends TypeORM's Repository for 
 * PermissionEntity.
 */
export class PermissionRepository extends Repository<PermissionEntity> {
    public constructor(ds: DataSource) {
        super(PermissionEntity, ds.createEntityManager(), ds.createQueryRunner());
    }
}
