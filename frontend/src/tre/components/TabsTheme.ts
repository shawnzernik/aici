import { CSSProperties } from "react";

export class TabsTheme {
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

    public static tabInactive: CSSProperties = {
        flexGrow: "0",
        flexShrink: "0",
        padding: "0.5em",
        borderBottom: "1pt solid black",
        cursor: "pointer",
    };

    public static tabContainer: CSSProperties = {
        display: "flex",
        flexDirection: "column",
        width: "100%"
    };

    public static tabRowContainer: CSSProperties = {
        display: "flex",
        flexDirection: "row",
        width: "100%"
    };

    public static space: CSSProperties = {
        borderBottom: "1pt solid black",
        flexGrow: "0",
        flexShrink: "0",
        padding: "0.5em",
    };

    public static spaceGrow: CSSProperties = {
        borderBottom: "1pt solid black",
        flexGrow: "1",
        flexShrink: "1",
        padding: "0.5em",
    };
}