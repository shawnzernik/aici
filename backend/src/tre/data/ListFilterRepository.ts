import { DataSource, Repository } from 'typeorm';
import { ListFilterEntity } from './ListFilterEntity';

/**
 * Repository class for managing ListFilterEntity instances.
 */
export class ListFilterRepository extends Repository<ListFilterEntity> {
    public constructor(ds: DataSource) {
        super(ListFilterEntity, ds.createEntityManager(), ds.createQueryRunner());
    }
}