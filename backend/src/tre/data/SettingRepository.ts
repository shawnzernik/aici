import { DataSource, Repository } from 'typeorm';
import { SettingEntity } from './SettingEntity';

/**
 * Custom repository for setting entities.
 */
export class SettingRepository extends Repository<SettingEntity> {
    public constructor(ds: DataSource) {
        super(SettingEntity, ds.createEntityManager(), ds.createQueryRunner());
    }

    public async findByKey(value: string): Promise<SettingEntity> {
        const ret = await this.findOneBy({ key: value });
        if (!ret)
            throw new Error(`Could not locate setting by key '${value}'!`);

        return ret as SettingEntity;
    }
}
