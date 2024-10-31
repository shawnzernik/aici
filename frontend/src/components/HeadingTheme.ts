import { CSSProperties } from "react";
import { Theme } from "./Theme";

/**
 * Generates a heading theme based on the level.
 * 
 * @param level - The heading level (1 to 6), where 1 is the largest and 6 is the smallest.
 * @returns An object representing the CSS styles for the heading.
 */
export function HeadingTheme(level: number): CSSProperties {
    return {
        fontFamily: "HeadingText",
        fontSize: 7 - level + "em",
        color: Theme.darkText
    };
};
