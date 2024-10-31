import { CSSProperties } from "react";

/**
 * A class that defines a theme for tabs with static CSS properties.
 */
export class TabsTheme {
    /** 
     * CSS properties for an active tab. 
     *  - Sets padding, color, border, border radius, and cursor.
     */
    public static tabActive: CSSProperties = {
        flexGrow: "0",
        flexShrink: "0",
        padding: "0.5em",
        color: "#08f",
        border: "1pt solid black",
        borderBottom: "none",
        borderTopLeftRadius: "0.25em",
        borderTopRightRadius: "0.25em",
        cursor: "pointer",
    };

    /** 
     * CSS properties for an inactive tab. 
     *  - Sets padding, border, and cursor.
     */
    public static tabInactive: CSSProperties = {
        flexGrow: "0",
        flexShrink: "0",
        padding: "0.5em",
        borderBottom: "1pt solid black",
        cursor: "pointer",
    };

    /** 
     * CSS properties for the container of tabs. 
     *  - Sets the layout direction to column.
     */
    public static tabContainer: CSSProperties = {
        display: "flex",
        flexDirection: "column",
        width: "100%"
    };

    /** 
     * CSS properties for the row container of tabs. 
     *  - Sets the layout direction to row.
     */
    public static tabRowContainer: CSSProperties = {
        display: "flex",
        flexDirection: "row",
        width: "100%"
    };

    /** 
     * CSS properties for a space between tabs. 
     *  - Sets a border and padding.
     */
    public static space: CSSProperties = {
        borderBottom: "1pt solid black",
        flexGrow: "0",
        flexShrink: "0",
        padding: "0.5em",
    };
    /** 
     * CSS properties for a space between tabs. 
     *  - Sets a border and padding.
     */
    public static spaceGrow: CSSProperties = {
        borderBottom: "1pt solid black",
        flexGrow: "1",
        flexShrink: "1",
        padding: "0.5em",
    };
}
