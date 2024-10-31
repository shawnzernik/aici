/**
 * Interface representing a list data transfer object (DTO).
 */
export interface ListDto {
    /** The unique identifier for the list. */
    guid: string;
    /** The title of the list. */
    title: string;
    /** The URL key for the list. */
    urlKey: string;
    /** The GUID of the top menu associated with the list. */
    topMenuGuid: string;
    /** The GUID of the left menu associated with the list. */
    leftMenuGuid: string;
    /** The SQL query related to the list. */
    sql: string;
    /** The edit URL for the list, if applicable. */
    editUrl?: string;
    /** Indicates whether the list should be loaded automatically. */
    autoload: boolean;
}
