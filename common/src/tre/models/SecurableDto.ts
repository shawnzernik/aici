/**
 * Interface representing a securable Data Transfer Object (DTO).
 */
export interface SecurableDto {
    /** 
     * Unique identifier for the securable entity. 
     */
    guid: string;

    /** 
     * Display name of the securable entity. 
     */
    displayName: string;
}
