/**
 * User Data Transfer Object
 */
export interface UserDto {
    /** Unique identifier for the user */
    guid: string;
    /** Display name of the user */
    displayName: string;
    /** Email address of the user */
    emailAddress: string;
    /** SMS phone number of the user */
    smsPhone: string;
}
