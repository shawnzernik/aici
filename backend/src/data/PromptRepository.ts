import { Repository } from 'typeorm';
import { PromptEntity } from './PromptEntity';

/**
 * PromptRepository class extends the TypeORM Repository for the PromptEntity.
 * It provides an access point to the data source for prompts, allowing
 * for the execution of queries and interactions with the underlying database.
 */
export class PromptRepository extends Repository<PromptEntity> {
}
