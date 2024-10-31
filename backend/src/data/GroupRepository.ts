import { Repository } from 'typeorm';
import { GroupEntity } from './GroupEntity';

/**
 * Class representing a Group Repository.
 * 
 * Extends the TypeORM Repository to provide database operations for GroupEntity.
 */
export class GroupRepository extends Repository<GroupEntity> {
}