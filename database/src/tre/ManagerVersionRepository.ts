import { DataSource, Repository } from 'typeorm';
import { ManagerVersionEntity } from './ManagerVersionEntity';

export class ManagerVersionRepository extends Repository<ManagerVersionEntity> {
    public constructor(ds: DataSource) {
        super(ManagerVersionEntity, ds.createEntityManager(), ds.createQueryRunner());
    }
}