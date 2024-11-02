import * as crypto from "crypto";
import { PasswordEntity } from "../data/PasswordEntity";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { SettingLogic } from "./SettingLogic";
import { UUIDv4 } from "common/src/tre/logic/UUIDv4";
import { PasswordLogic as CommonPasswordLogic } from "common/src/tre/logic/PasswordLogic";
import { SettingRepository } from "../data/SettingRepository";
import { UserRepository } from "../data/UserRepository";

/**
 * Handles password-related operations, including hashing and resetting passwords.
 * Extends common password logic to incorporate additional functionalities specific to the application.
 */
export class PasswordLogic extends CommonPasswordLogic {

    /**
     * The password entity associated with the user, containing hash, salt, iterations, and user GUID.
     */
    private entity: PasswordEntity;

    /**
     * Creates an instance of PasswordLogic.
     * If a PasswordEntity is provided, it uses the existing entity.
     * Otherwise, it initializes a new PasswordEntity with default values.
     * 
     * @param entity Optional existing PasswordEntity to initialize with.
     */
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

    /**
     * Computes the hash of the provided password using PBKDF2 with the entity's salt and iterations.
     * Updates the password entity with the computed hash.
     * 
     * @param password The plaintext password to hash.
     * @returns The updated PasswordEntity containing the hashed password.
     */
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

    /**
     * Resets the user's password after validating the new password against defined security policies.
     * 
     * @param ds The data source for accessing user and setting repositories.
     * @param usersGuid The GUID of the user whose password is to be reset.
     * @param password The new password provided by the user.
     * @param confirm The confirmation of the new password.
     * @returns A promise that resolves to the updated PasswordEntity with the new hashed password.
     * @throws Will throw an error if the user is not found, passwords are missing or do not match,
     *         or if the new password does not meet the security requirements.
     */
    public async reset(ds: EntitiesDataSource, usersGuid: string, password: string, confirm: string): Promise<PasswordEntity> {
        // Retrieve the user entity by GUID
        const userEntity = await new UserRepository(ds).findOneBy({ guid: usersGuid });
        if (!userEntity)
            throw new Error(`Could not locate user by GUID '${usersGuid}'!`);

        // Validate password and confirmation
        if (!password || !confirm)
            throw new Error("You must provide a password and a confirm!");

        if (password !== confirm)
            throw new Error("The password and confirm do not match!");

        // Retrieve and apply minimum length setting
        let settingEntity = await new SettingRepository(ds).findByKey(CommonPasswordLogic.MINIMUM_LENGTH_SETTING);
        let settingLogic = new SettingLogic(settingEntity);

        const minLength = settingLogic.integerValue();
        if (password.length < minLength)
            throw new Error(`Password provided is less than ${minLength} characters in length!`);

        // Retrieve and enforce lowercase requirement
        settingEntity = await new SettingRepository(ds).findByKey(CommonPasswordLogic.REQUIRE_LOWERCASE_SETTING);
        settingLogic = new SettingLogic(settingEntity);
        if (settingLogic.booleanValue() && !/[a-z]/.test(password))
            throw new Error("The password must have lowercase characters!");

        // Retrieve and enforce numeric requirement
        settingEntity = await new SettingRepository(ds).findByKey(CommonPasswordLogic.REQUIRE_NUMBER_SETTING);
        settingLogic = new SettingLogic(settingEntity);
        if (settingLogic.booleanValue() && !/[0-9]/.test(password))
            throw new Error("The password must have numbers!");

        // Retrieve and enforce symbol requirement
        settingEntity = await new SettingRepository(ds).findByKey(CommonPasswordLogic.REQUIRE_SYMBOLS_SETTING);
        settingLogic = new SettingLogic(settingEntity);
        if (settingLogic.booleanValue() && !/[^A-Za-z0-9]/.test(password))
            throw new Error("The password must have symbols!");

        // Retrieve and enforce uppercase requirement
        settingEntity = await new SettingRepository(ds).findByKey(CommonPasswordLogic.REQUIRE_UPPERCASE_SETTING);
        settingLogic = new SettingLogic(settingEntity);
        if (settingLogic.booleanValue() && !/[A-Z]/.test(password))
            throw new Error("The password must have uppercase characters!");

        // Retrieve and set iterations for hashing
        settingEntity = await new SettingRepository(ds).findByKey(CommonPasswordLogic.ITERATIONS_SETTING);
        settingLogic = new SettingLogic(settingEntity);
        this.entity.iterations = settingLogic.integerValue();
        this.entity.usersGuid = userEntity.guid;

        // Compute and return the new hashed password
        return this.computeHash(password);
    }
}
