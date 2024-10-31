import { Repository } from 'typeorm';
import { PasswordEntity } from './PasswordEntity';

/**
 * Represents a repository for managing password entities.
 * Inherits from the TypeORM Repository class specifically for PasswordEntity.
 */
export class PasswordRepository extends Repository<PasswordEntity> {
}
