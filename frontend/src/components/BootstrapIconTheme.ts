import * as React from "react";

/**
 * Generates a Bootstrap icon theme based on the size provided.
 *
 * @param size - The size of the icon in em units.
 * @returns An object representing the CSS properties for the icon.
 */
export function BootstrapIconTheme(size: number): React.CSSProperties {
    return {
        fontSize: size + "em"
    };
}
