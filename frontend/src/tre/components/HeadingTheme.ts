import { CSSProperties } from "react";
import { Theme } from "./Theme";

export function HeadingTheme(level: number): CSSProperties {
    return {
        fontFamily: "HeadingText",
        fontSize: 7 - level + "em",
        color: Theme.darkText
    };
};
