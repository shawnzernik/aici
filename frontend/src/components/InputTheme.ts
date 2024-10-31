import { CSSProperties } from "react";
import { Theme } from "./Theme";

/**
 * InputTheme defines the styles for input components.
 * It is an object conforming to the CSSProperties interface.
 */
export const InputTheme: CSSProperties = {
    /** The width of the input component. */
    width: "100%",
    /** Displays the input component as a flex container. */
    display: "flex",
    /** The direction in which flex items are placed in the flex container. */
    flexDirection: "row",
    /** Defines how flex items wrap within the flex container. */
    flexWrap: "wrap",
    /** The space between flex items. */
    gap: "1em",
    /** Justifies flex items within the container. */
    justifyContent: "center",
    /** Padding inside the input component. */
    padding: "0.5em",
    /** Border radius of the input component. */
    borderRadius: "0.25em",
    /** Border of the input component, using a value from the Theme. */
    border: "1px solid " + Theme.darkNeutral,
    /** Text color of the input component, using a value from the Theme. */
    color: Theme.darkText
};
