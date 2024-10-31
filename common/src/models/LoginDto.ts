/**
 * Interface for the Login Data Transfer Object (DTO).
 */
export interface LoginDto {
    /** 
     * The user's email address. 
     */
    emailAddress: string;

    /** 
     * The user's password. 
     */
    password: string;
}
