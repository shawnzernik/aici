import { CSSProperties } from "react";
import { Theme } from "./Theme";

/**
 * Class representing a theme for form fields.
 */
export class FieldTheme {

    /** 
     * Static property representing the styles for the field component. 
     */
    public static field: CSSProperties = {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        gap: "1em",
        alignItems: "baseline",
        justifyContent: "left",
        paddingTop: "0.5em",
        paddingBottom: "0.5em"
    };

    /** 
     * Static property representing the styles for the field label component. 
     */
    public static fieldLabel: CSSProperties = {
        paddingTop: "0.5em",
        paddingBottom: "0.5em",
        width: Theme.FormLabelWidthEm + "em",
        minWidth: Theme.FormLabelWidthEm + "em",
        textAlign: "right"
    };
}
