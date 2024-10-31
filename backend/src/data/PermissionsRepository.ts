import { Repository } from 'typeorm';
import { PermissionEntity } from './PermissionEntity';

/**
 * PermissionRepository class that extends TypeORM's Repository for 
 * PermissionEntity.
 */
export class PermissionRepository extends Repository<PermissionEntity> {
}
