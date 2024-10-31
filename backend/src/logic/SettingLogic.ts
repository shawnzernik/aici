import { SettingEntity } from "../data/SettingEntity";

/**
 * Handles logic related to application settings, providing utility methods to retrieve
 * setting values in specific data types.
 */
export class SettingLogic {
    /**
     * The setting entity containing the key and value of the setting.
     */
    private entity: SettingEntity;

    /**
     * Creates an instance of SettingLogic.
     * @param entity The setting entity containing the key and value.
     */
    public constructor(entity: SettingEntity) {
        this.entity = entity;
    }

    /**
     * Retrieves the setting value as an integer.
     * 
     * @returns The integer representation of the setting value.
     * @throws Will throw an error if the setting value is not a valid integer.
     */
    public integerValue(): number {
        const ret = Number.parseInt(this.entity.value);
        if (!Number.isInteger(ret))
            throw new Error(`The value '${this.entity.value}' for setting '${this.entity.key}' is not an integer!`);
        return ret;
    }

    /**
     * Retrieves the setting value as a boolean.
     * Interprets the value as `true` if it starts with 't', 'y', or '1' (case-insensitive).
     * Otherwise, interprets it as `false`.
     * 
     * @returns The boolean representation of the setting value.
     */
    public booleanValue(): boolean {
        if (!this.entity.value)
            return false;

        const firstChar = this.entity.value.toLowerCase().charAt(0);
        return firstChar === "t" || firstChar === "y" || firstChar === "1";
    }
}
