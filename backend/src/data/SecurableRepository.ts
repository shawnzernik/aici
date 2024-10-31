import { Repository } from 'typeorm';
import { SecurableEntity } from './SecurableEntity';

/**
 * A repository for managing SecurableEntity instances.
 * @extends Repository<SecurableEntity>
 */
export class SecurableRepository extends Repository<SecurableEntity> {
}
