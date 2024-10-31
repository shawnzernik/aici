import { Repository } from 'typeorm';
import { MembershipEntity } from './MembershipEntity';

/**
 * MembershipRepository class extends the TypeORM Repository for MembershipEntity,
 * providing an interface for interacting with the MembershipEntity
 * in the database.
 */
export class MembershipRepository extends Repository<MembershipEntity> {
}