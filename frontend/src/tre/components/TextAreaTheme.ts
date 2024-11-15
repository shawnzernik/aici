import { CSSProperties } from "react";
import { Theme } from "./Theme";

export const TextAreaTheme: CSSProperties = {
    width: "100%",
    padding: "0.5em",
    borderRadius: "0.25em",
    border: "1px solid " + Theme.darkNeutral,
    color: Theme.darkText
};
