import { Repository } from 'typeorm';
import { FinetuneEntity } from './FinetuneEntity';

/**
 * FinetuneRepository class extends the TypeORM Repository for the FinetuneEntity.
 * This class can be used to define custom database interactions related to the
 * FinetuneEntity.
 */
export class FinetuneRepository extends Repository<FinetuneEntity> {
}