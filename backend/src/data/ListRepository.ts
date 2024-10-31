import { Repository } from 'typeorm';
import { ListEntity } from './ListEntity';

/**
 * ListRepository class extends the TypeORM Repository class for the ListEntity.
 * It can be used to define custom data access methods for the ListEntity.
 */
export class ListRepository extends Repository<ListEntity> {
}