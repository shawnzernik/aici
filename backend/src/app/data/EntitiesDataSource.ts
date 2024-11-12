import { DataSourceOptions } from "typeorm";
import { Config } from "../../Config";
import { EntitiesDataSource as TreEntitiesDataSource } from "../../tre/data/EntitiesDataSource";
import { GroupEntity } from "../../tre/data/GroupEntity";
import { ListEntity } from "../../tre/data/ListEntity";
import { ListFilterEntity } from "../../tre/data/ListFilterEntity";
import { LogEntity } from "../../tre/data/LogEntity";
import { MembershipEntity } from "../../tre/data/MembershipEntity";
import { MenuEntity } from "../../tre/data/MenuEntity";
import { PasswordEntity } from "../../tre/data/PasswordEntity";
import { PermissionEntity } from "../../tre/data/PermissionEntity";
import { SecurableEntity } from "../../tre/data/SecurableEntity";
import { SettingEntity } from "../../tre/data/SettingEntity";
import { UserEntity } from "../../tre/data/UserEntity";
import { DatasetEntity } from "./DatasetEntity";
import { FinetuneEntity } from "./FinetuneEntity";
import { PromptEntity } from "./PromptEntity";

export class EntitiesDataSource extends TreEntitiesDataSource {
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

                // add app entities here
                DatasetEntity,
                FinetuneEntity,
                PromptEntity
            ],
        });
    }
}