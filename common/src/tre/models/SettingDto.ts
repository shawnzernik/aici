/**
 * Interface representing a settings data transfer object.
 */
export interface SettingDto {
    /** Unique identifier for the setting. */
    guid: string;
    /** The key of the setting. */
    key: string;
    /** The value of the setting. */
    value: string;
}
