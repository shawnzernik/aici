import { DataSource, Repository } from 'typeorm';
import { LogEntity } from './LogEntity';

/**
 * LogRepository class extends TypeORM's Repository for LogEntity.
 * It provides an abstraction layer for database operations related to logs.
 */
export class LogRepository extends Repository<LogEntity> {
    public constructor(ds: DataSource) {
        super(LogEntity, ds.createEntityManager(), ds.createQueryRunner());
    }
}
