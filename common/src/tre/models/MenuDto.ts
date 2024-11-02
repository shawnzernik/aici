/**
 * Represents a menu data transfer object.
 */
export interface MenuDto {
    /** The unique identifier for the menu item. */
    guid: string;
    /** The GUID of the parent menu item, or null if it has no parent. */
    parentsGuid: string | null;
    /** The order in which the menu item should appear. */
    order: number;
    /** The display name of the menu item. */
    display: string;
    /** The Bootstrap icon class associated with the menu item. */
    bootstrapIcon: string;
    /** The URL that the menu item points to. */
    url: string;
}
