import { DataSource, DataSourceOptions } from "typeorm";
import { GroupEntity } from "./GroupEntity";
import { MembershipEntity } from "./MembershipEntity";
import { PasswordEntity } from "./PasswordEntity";
import { PermissionEntity } from "./PermissionEntity";
import { SecurableEntity } from "./SecurableEntity";
import { UserEntity } from "./UserEntity";
import { Config } from "../../Config";
import { MenuEntity } from "./MenuEntity";
import { ListEntity } from "./ListEntity";
import { ListFilterEntity } from "./ListFilterEntity";
import { SettingEntity } from "./SettingEntity";
import { LogEntity } from "./LogEntity";

export class EntitiesDataSource extends DataSource {
    public constructor(options?: DataSourceOptions) {
        super(options ? options : {
            type: "postgres",
            host: Config.dbHost,
            port: Config.dbPort,
            database: Config.dbName,
            username: Config.dbUsername,
            password: Config.dbPassword,
            entities: [
                GroupEntity,
                MembershipEntity,
                PasswordEntity,
                PermissionEntity,
                SecurableEntity,
                UserEntity,
                MenuEntity,
                ListEntity,
                ListFilterEntity,
                SettingEntity,
                LogEntity,
            ],
        });
    }

    public async executeSql(sql: string, params: any[]): Promise<any[]> {
        const queryRunner = this.createQueryRunner();

        try {
            await queryRunner.connect();
            const result = await queryRunner.query(sql, params);
            return result;
        }
        catch (err) {
            throw new Error(`Error executing:\n${sql}\n${err}`);
        }
        finally {
            await queryRunner.release();
        }
    }
}