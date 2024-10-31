import { Repository } from 'typeorm';
import { MenuEntity } from './MenuEntity';

/**
 * MenuRepository extends TypeORM's Repository for MenuEntity.
 * It provides an interface for interacting with the MenuEntity data in the database.
 */
export class MenuRepository extends Repository<MenuEntity> {
}
