/**
 * Interface representing a permission data transfer object.
 */
export interface PermissionDto {
    /** 
     * Unique identifier for the permission. 
     */
    guid: string;
    /** 
     * Unique identifier for the groups associated with the permission. 
     */
    groupsGuid: string;
    /** 
     * Unique identifier for the securables associated with the permission. 
     */
    securablesGuid: string;
    /** 
     * Indicates whether the permission is allowed. 
     */
    isAllowed: boolean;
}
