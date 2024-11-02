import { CSSProperties } from "react";
import { Theme } from "./Theme";

/**
 * Theme configuration for the form component.
 * 
 * This object defines the styles used in the form component.
 */
export const FormTheme: CSSProperties = {
    /** 
     * Sets the width of the form to 100% of its container.
     */
    width: "100%",
    /**
     * Sets the display type of the form to flex, enabling flexible layout.
     */
    display: "flex",
    /**
     * Sets the flex direction of the form's children to row.
     */
    flexDirection: "row",
    /**
     * Allows the form's children to wrap onto multiple lines if necessary.
     */
    flexWrap: "wrap",
    /**
     * Justifies the children of the form to the start of the container.
     */
    justifyContent: "start"
};
