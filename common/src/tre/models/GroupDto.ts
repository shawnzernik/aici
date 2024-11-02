// GroupDto interface represents a data transfer object for a user group.
export interface GroupDto {
    /** Unique identifier for the group */
    guid: string;
    /** Display name of the group */
    displayName: string;
    /** Indicates if the user is an administrator of the group */
    isAdministrator: boolean;
}
