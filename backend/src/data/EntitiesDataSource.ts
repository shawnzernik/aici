import { DataSource } from "typeorm";
import { GroupEntity } from "./GroupEntity";
import { MembershipEntity } from "./MembershipEntity";
import { PasswordEntity } from "./PasswordEntity";
import { PermissionEntity } from "./PermissionEntity";
import { SecurableEntity } from "./SecurableEntity";
import { UserEntity } from "./UserEntity";
import { FinetuneEntity } from "./FinetuneEntity";
import { Config } from "../Config";
import { UserRepository } from "./UserRepository";
import { GroupRepository } from "./GroupRepository";
import { MembershipRepository } from "./MembershipsRepository";
import { PasswordRepository } from "./PasswordRepository";
import { PermissionRepository } from "./PermissionsRepository";
import { SecurableRepository } from "./SecurableRepository";
import { MenuEntity } from "./MenuEntity";
import { MenuRepository } from "./MenuRepository";
import { ListRepository } from "./ListRepository";
import { ListEntity } from "./ListEntity";
import { ListFilterEntity } from "./ListFilterEntity";
import { SettingEntity } from "./SettingEntity";
import { ListFilterRepository } from "./ListFilterRepository";
import { SettingRepository } from "./SettingRepository";
import { DatasetEntity } from "./DatasetEntity";
import { DatasetRepository } from "./DatasetRepository";
import { LogRepository } from "./LogRepository";
import { LogEntity } from "./LogEntity";
import { PromptEntity } from "./PromptEntity";
import { PromptRepository } from "./PromptRepository";
import { FinetuneRepository } from "./FinetuneRepository";

/**
 * Custom DataSource class for managing entity repositories and database connections.
 */
export class EntitiesDataSource extends DataSource {
    /**
     * Constructor for EntitiesDataSource.
     * Initializes the DataSource with database configuration and entity settings.
     */
    public constructor() {
        super({
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
                FinetuneEntity,
                MenuEntity,
                ListEntity,
                ListFilterEntity,
                SettingEntity,
                DatasetEntity,
                LogEntity,
                PromptEntity,
            ],
        });
    }

    /**
     * Executes a raw SQL query against the database.
     * @param sql - The SQL query to execute.
     * @param params - The parameters for the SQL query.
     * @returns A promise that resolves to an array of results.
     */
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

    private _groupRepository: GroupRepository | undefined;

    /**
     * Gets an instance of the GroupRepository.
     * @returns The GroupRepository instance.
     */
    public groupRepository() {
        if (!this._groupRepository)
            this._groupRepository = new GroupRepository(GroupEntity, this.createEntityManager(), this.createQueryRunner());
        return this._groupRepository;
    }

    private _membershipRepository: MembershipRepository | undefined;

    /**
     * Gets an instance of the MembershipRepository.
     * @returns The MembershipRepository instance.
     */
    public membershipRepository() {
        if (!this._membershipRepository)
            this._membershipRepository = new MembershipRepository(MembershipEntity, this.createEntityManager(), this.createQueryRunner());
        return this._membershipRepository;
    }

    private _passwordRepository: PasswordRepository | undefined;

    /**
     * Gets an instance of the PasswordRepository.
     * @returns The PasswordRepository instance.
     */
    public passwordRepository() {
        if (!this._passwordRepository)
            this._passwordRepository = new PasswordRepository(PasswordEntity, this.createEntityManager(), this.createQueryRunner());
        return this._passwordRepository;
    }

    private _permissionRepository: PermissionRepository | undefined;

    /**
     * Gets an instance of the PermissionRepository.
     * @returns The PermissionRepository instance.
     */
    public permissionRepository() {
        if (!this._permissionRepository)
            this._permissionRepository = new PermissionRepository(PermissionEntity, this.createEntityManager(), this.createQueryRunner());
        return this._permissionRepository;
    }

    private _securableRepository: SecurableRepository | undefined;

    /**
     * Gets an instance of the SecurableRepository.
     * @returns The SecurableRepository instance.
     */
    public securableRepository() {
        if (!this._securableRepository)
            this._securableRepository = new SecurableRepository(SecurableEntity, this.createEntityManager(), this.createQueryRunner());
        return this._securableRepository;
    }

    private _userRepository: UserRepository | undefined;

    /**
     * Gets an instance of the UserRepository.
     * @returns The UserRepository instance.
     */
    public userRepository() {
        if (!this._userRepository)
            this._userRepository = new UserRepository(UserEntity, this.createEntityManager(), this.createQueryRunner());
        return this._userRepository;
    }

    private _finetuneRepository: FinetuneRepository | undefined;

    /**
     * Gets an instance of the FinetuneRepository.
     * @returns The FinetuneRepository instance.
     */
    public finetuneRepository() {
        if (!this._finetuneRepository)
            this._finetuneRepository = new FinetuneRepository(FinetuneEntity, this.createEntityManager(), this.createQueryRunner());
        return this._finetuneRepository;
    }

    private _menuRepository: MenuRepository | undefined;

    /**
     * Gets an instance of the MenuRepository.
     * @returns The MenuRepository instance.
     */
    public menuRepository() {
        if (!this._menuRepository)
            this._menuRepository = new MenuRepository(MenuEntity, this.createEntityManager(), this.createQueryRunner());
        return this._menuRepository;
    }

    private _listRepository: ListRepository | undefined;

    /**
     * Gets an instance of the ListRepository.
     * @returns The ListRepository instance.
     */
    public listRepository() {
        if (!this._listRepository)
            this._listRepository = new ListRepository(ListEntity, this.createEntityManager(), this.createQueryRunner());
        return this._listRepository;
    }

    private _listFilterRepository: ListFilterRepository | undefined;

    /**
     * Gets an instance of the ListFilterRepository.
     * @returns The ListFilterRepository instance.
     */
    public listFilterRepository() {
        if (!this._listFilterRepository)
            this._listFilterRepository = new ListFilterRepository(ListFilterEntity, this.createEntityManager(), this.createQueryRunner());
        return this._listFilterRepository;
    }

    private _settingRepository: SettingRepository | undefined;

    /**
     * Gets an instance of the SettingRepository.
     * @returns The SettingRepository instance.
     */
    public settingRepository() {
        if (!this._settingRepository)
            this._settingRepository = new SettingRepository(SettingEntity, this.createEntityManager(), this.createQueryRunner());
        return this._settingRepository;
    }

    private _datasetRepository: DatasetRepository | undefined;

    /**
     * Gets an instance of the DatasetRepository.
     * @returns The DatasetRepository instance.
     */
    public datasetRepository() {
        if (!this._datasetRepository)
            this._datasetRepository = new DatasetRepository(DatasetEntity, this.createEntityManager(), this.createQueryRunner());
        return this._datasetRepository;
    }

    private _logRepository: LogRepository | undefined;

    /**
     * Gets an instance of the LogRepository.
     * @returns The LogRepository instance.
     */
    public logRepository() {
        if (!this._logRepository)
            this._logRepository = new LogRepository(LogEntity, this.createEntityManager(), this.createQueryRunner());
        return this._logRepository;
    }

    private _promptRepository: PromptRepository | undefined;

    /**
     * Gets an instance of the PromptRepository.
     * @returns The PromptRepository instance.
     */
    public promptRepository() {
        if (!this._promptRepository)
            this._promptRepository = new PromptRepository(PromptEntity, this.createEntityManager(), this.createQueryRunner());
        return this._promptRepository;
    }
}