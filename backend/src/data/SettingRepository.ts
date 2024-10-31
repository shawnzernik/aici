import { Repository } from 'typeorm';
import { SettingEntity } from './SettingEntity';

/**
 * Custom repository for setting entities.
 */
export class SettingRepository extends Repository<SettingEntity> {
    /**
     * Finds a setting entity by its key.
     * @param value - The key of the setting to find.
     * @returns The found SettingEntity object.
     * @throws Error if no setting is located with the provided key.
     */
    async findByKey(value: string): Promise<SettingEntity> {
        const ret = await this.findOneBy({ key: value });
        if (!ret)
            throw new Error(`Could not locate setting by key '${value}'!`);

        return ret as SettingEntity;
    }
}
