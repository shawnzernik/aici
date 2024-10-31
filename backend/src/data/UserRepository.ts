import { Repository } from 'typeorm';
import { UserEntity } from './UserEntity';

/**
 * UserRepository class that extends the TypeORM Repository for the UserEntity.
 */
export class UserRepository extends Repository<UserEntity> {
}
