import { CSSProperties } from "react";
import { Theme } from "./Theme";

export const SelectTheme: CSSProperties = {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: "1em",
    justifyContent: "center",
    padding: "0.5em",
    borderRadius: "0.25em",
    border: "1px solid " + Theme.darkNeutral,
    color: Theme.darkText,
    background: Theme.lightNeutral
};