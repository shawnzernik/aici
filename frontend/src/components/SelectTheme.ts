import { CSSProperties } from "react";
import { Theme } from "./Theme";

/**
 * Represents the style configuration for selecting a theme.
 * 
 * This object defines the visual appearance and layout
 * properties for the component that allows users to select
 * a available themes.
 */
export const SelectTheme: CSSProperties = {
    /** 
     * Sets the width of the component to 100% of its parent container.
     */
    width: "100%",

    /** 
     * Specifies the display behavior as a flex container.
     */
    display: "flex",

    /** 
     * Defines the direction of flex items as a row.
     */
    flexDirection: "row",

    /** 
     * Allows flex items to wrap onto multiple lines, if necessary.
     */
    flexWrap: "wrap",

    /** 
     * Sets the space between flex items to 1em.
     */
    gap: "1em",

    /** 
     * Justifies flex items to be centered within the container.
     */
    justifyContent: "center",

    /** 
     * Adds padding inside the component of 0.5em.
     */
    padding: "0.5em",

    /** 
     * Rounds the corners of the component's border.
     */
    borderRadius: "0.25em",

    /** 
     * Sets the border style and color using the dark neutral theme.
     */
    border: "1px solid " + Theme.darkNeutral,

    /** 
     * Sets the text color using the dark text theme.
     */
    color: Theme.darkText,

    /** 
     * Sets the background color using the light neutral theme.
     */
    background: Theme.lightNeutral
};
