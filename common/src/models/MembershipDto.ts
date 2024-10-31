/**
 * Interface representing a Membership Data Transfer Object (DTO).
 */
export interface MembershipDto {
    /** 
     * Unique Identifier for the membership.
     * @public 
     */
    guid: string;
    /** 
     * Unique Identifier for the group associated with the membership.
     * @public 
     */
    groupsGuid: string;
    /** 
     * Unique Identifier for the user associated with the membership.
     * @public 
     */
    usersGuid: string;
    /** 
     * Indicates whether the user is included in the membership.
     * @public 
     */
    isIncluded: boolean;
}
