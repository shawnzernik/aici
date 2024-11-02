import { DataSource, Repository } from 'typeorm';
import { PasswordEntity } from './PasswordEntity';

/**
 * Represents a repository for managing password entities.
 * Inherits from the TypeORM Repository class specifically for PasswordEntity.
 */
export class PasswordRepository extends Repository<PasswordEntity> {
    public constructor(ds: DataSource) {
        super(PasswordEntity, ds.createEntityManager(), ds.createQueryRunner());
    }
}
