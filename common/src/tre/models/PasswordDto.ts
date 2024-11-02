/**
 * Interface representing a Password Data Transfer Object (DTO).
 */
export interface PasswordDto {
    /** 
     * Unique identifier for the Password DTO.
     * @type {string}
     */
    guid: string;

    /** 
     * Unique identifier for the associated user.
     * @type {string}
     */
    usersGuid: string;

    /** 
     * Date when the password was created.
     * @type {Date}
     */
    created: Date;

    /** 
     * Salt used for hashing the password.
     * @type {string}
     */
    salt: string;

    /** 
     * Hash of the password.
     * @type {string}
     */
    hash: string;

    /** 
     * Number of iterations used in the hashing algorithm.
     * @type {number}
     */
    iterations: number;
}
