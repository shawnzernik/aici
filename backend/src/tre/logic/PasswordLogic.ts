import * as crypto from "crypto";
import { PasswordEntity } from "../data/PasswordEntity";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { SettingLogic } from "./SettingLogic";
import { UUIDv4 } from "common/src/tre/logic/UUIDv4";
import { PasswordLogic as CommonPasswordLogic } from "common/src/tre/logic/PasswordLogic";
import { SettingRepository } from "../data/SettingRepository";
import { UserRepository } from "../data/UserRepository";

export class PasswordLogic extends CommonPasswordLogic {

    private entity: PasswordEntity;

    public constructor(entity?: PasswordEntity) {
        super();

        if (entity) {
            this.entity = entity;
        } else {
            this.entity = new PasswordEntity();
            this.entity.guid = UUIDv4.generate();
            this.entity.iterations = 1000000;
            this.entity.salt = crypto.randomBytes(32).toString("hex");
        }
    }

    public computeHash(password: string): PasswordEntity {
        this.entity.hash = crypto.pbkdf2Sync(
            password,
            this.entity.salt,
            this.entity.iterations,
            64,
            "sha512"
        ).toString("hex");
        return this.entity;
    }

    public async reset(ds: EntitiesDataSource, usersGuid: string, password: string, confirm: string): Promise<PasswordEntity> {
        const userEntity = await new UserRepository(ds).findOneBy({ guid: usersGuid });
        if (!userEntity)
            throw new Error(`Could not locate user by GUID "${usersGuid}"!`);

        if (!password || !confirm)
            throw new Error("You must provide a password and a confirm!");

        if (password !== confirm)
            throw new Error("The password and confirm do not match!");

        let settingEntity = await new SettingRepository(ds).findByKey(CommonPasswordLogic.MINIMUM_LENGTH_SETTING);
        let settingLogic = new SettingLogic(settingEntity);

        const minLength = settingLogic.integerValue();
        if (password.length < minLength)
            throw new Error(`Password provided is less than ${minLength} characters in length!`);

        settingEntity = await new SettingRepository(ds).findByKey(CommonPasswordLogic.REQUIRE_LOWERCASE_SETTING);
        settingLogic = new SettingLogic(settingEntity);
        if (settingLogic.booleanValue() && !/[a-z]/.test(password))
            throw new Error("The password must have lowercase characters!");

        settingEntity = await new SettingRepository(ds).findByKey(CommonPasswordLogic.REQUIRE_NUMBER_SETTING);
        settingLogic = new SettingLogic(settingEntity);
        if (settingLogic.booleanValue() && !/[0-9]/.test(password))
            throw new Error("The password must have numbers!");

        settingEntity = await new SettingRepository(ds).findByKey(CommonPasswordLogic.REQUIRE_SYMBOLS_SETTING);
        settingLogic = new SettingLogic(settingEntity);
        if (settingLogic.booleanValue() && !/[^A-Za-z0-9]/.test(password))
            throw new Error("The password must have symbols!");

        settingEntity = await new SettingRepository(ds).findByKey(CommonPasswordLogic.REQUIRE_UPPERCASE_SETTING);
        settingLogic = new SettingLogic(settingEntity);
        if (settingLogic.booleanValue() && !/[A-Z]/.test(password))
            throw new Error("The password must have uppercase characters!");

        settingEntity = await new SettingRepository(ds).findByKey(CommonPasswordLogic.ITERATIONS_SETTING);
        settingLogic = new SettingLogic(settingEntity);
        this.entity.iterations = settingLogic.integerValue();
        this.entity.usersGuid = userEntity.guid;

        return this.computeHash(password);
    }
}