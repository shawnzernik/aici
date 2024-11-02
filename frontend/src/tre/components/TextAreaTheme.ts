import { CSSProperties } from "react";
import { Theme } from "./Theme";

/**
 * TextAreaTheme provides the default theme properties for TextArea components.
 */
export const TextAreaTheme: CSSProperties = {
    /** The width of the textarea. */
    width: "100%",
    /** The padding inside the textarea. */
    padding: "0.5em",
    /** The border radius of the textarea. */
    borderRadius: "0.25em",
    /** The border style of the textarea. */
    border: "1px solid " + Theme.darkNeutral,
    /** The text color of the textarea. */
    color: Theme.darkText
};
