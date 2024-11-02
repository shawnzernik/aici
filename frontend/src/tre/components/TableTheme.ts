import { CSSProperties } from "react";
import { Theme } from "./Theme";

/**
 * A class representing the styles for tables.
 */
export class TableTheme {
    /** 
     * CSS styles for the table. 
     */
    static table: CSSProperties = {
        // border: "1pt solid " + Theme.mediumNeutral
    };

    /** 
     * CSS styles for the table head cells. 
     */
    static tableHeadTd: CSSProperties = {
        // border: "1pt solid " + Theme.mediumNeutral,
        // background: Theme.mediumNeutral,
        // color: Theme.darkText
    };

    /** 
     * CSS styles for the table row cells. 
     */
    static tableRowTd: CSSProperties = {
        // border: "1pt solid " + Theme.mediumNeutral
    };

    /** 
     * CSS styles for the table row cells that contain icons. 
     */
    static tableRowTdIcon: CSSProperties = {
        color: Theme.darkText,
        cursor: "pointer"
    };
}
