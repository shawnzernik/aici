import { DataSource, EntityManager, QueryRunner, Repository } from 'typeorm';
import { GroupEntity } from './GroupEntity';

/**
 * Class representing a Group Repository.
 * 
 * Extends the TypeORM Repository to provide database operations for GroupEntity.
 */
export class GroupRepository extends Repository<GroupEntity> {
    public constructor(ds: DataSource) {
        super(GroupEntity, ds.createEntityManager(), ds.createQueryRunner());
    }
}