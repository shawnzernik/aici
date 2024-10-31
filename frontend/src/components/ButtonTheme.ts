// Importing necessary types from React and a Theme object from a local file
import { CSSProperties } from "react";
import { Theme } from "./Theme";

// ButtonTheme object that defines the styles for a button component
export const ButtonTheme: CSSProperties = {
    // Border style of the button using a property from the Theme object
    border: "0.01em solid " + Theme.darkNeutral,
    // Radius of the button's corners
    borderRadius: "0.25em",
    // Padding inside the button
    padding: "1em",
    // Font family for the button text
    fontFamily: Theme.BodyFont,
    // Text color of the button using a property from the Theme object
    color: Theme.darkText
};
