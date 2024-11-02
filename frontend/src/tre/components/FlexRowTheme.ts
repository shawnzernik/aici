import { CSSProperties } from "react";
import { Theme } from "./Theme";

/**
 * Defines a flexible row layout theme for use in components.
 * 
 * This theme can be applied to container elements to achieve
 * a consistent flex row layout with specified properties.
 */
export const FlexRowTheme: CSSProperties = {
    /** Sets the width to 100% of the parent container */
    width: "100%",
    /** Enables flexbox layout model */
    display: "flex",
    /** Sets flex direction to row */
    flexDirection: "row",
    /** Allows flex items to wrap onto multiple lines */
    flexWrap: "wrap",
    /** Sets the gap between flex items */
    gap: "1em",
};
