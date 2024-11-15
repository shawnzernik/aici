import { CSSProperties } from "react";
import { Theme } from "./Theme";

export const ButtonTheme: CSSProperties = {
    border: "0.01em solid " + Theme.darkNeutral,
    borderRadius: "0.25em",
    padding: "1em",
    fontFamily: Theme.BodyFont,
    color: Theme.darkText
};