import { DataSource, Repository } from 'typeorm';
import { DatasetEntity } from './DatasetEntity';

/**
 * DatasetRepository class extends the TypeORM Repository for DatasetEntity.
 * It provides an abstraction over the database interactions specific to
 * DatasetEntity.
 */
export class DatasetRepository extends Repository<DatasetEntity> {
    public constructor(ds: DataSource) {
        super(DatasetEntity, ds.createEntityManager(), ds.createQueryRunner());
    }
}