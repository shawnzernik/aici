import { CSSProperties } from "react";
import { Theme } from "./Theme";

export class FieldTheme {

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

    public static fieldLabel: CSSProperties = {
        paddingTop: "0.5em",
        paddingBottom: "0.5em",
        width: Theme.FormLabelWidthEm + "em",
        minWidth: Theme.FormLabelWidthEm + "em",
        textAlign: "right"
    };
}
