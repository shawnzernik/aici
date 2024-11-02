import { DataSource, Repository } from 'typeorm';
import { SecurableEntity } from './SecurableEntity';

/**
 * A repository for managing SecurableEntity instances.
 * @extends Repository<SecurableEntity>
 */
export class SecurableRepository extends Repository<SecurableEntity> {
    public constructor(ds: DataSource) {
        super(SecurableEntity, ds.createEntityManager(), ds.createQueryRunner());
    }
}
