import * as React from "react";
import { BootstrapIconTheme } from "./BootstrapIconTheme";

/**
 * Props for the BootstrapIcon component.
 */
interface Props {
    /** Name of the Bootstrap icon. */
    name: string;
    /** Size of the icon. */
    size: number;
    /** Color of the icon. Optional. */
    color?: string;

    /** Additional CSS class(es) for the icon. Optional. */
    className?: string;
    /** Additional CSS styles for the icon. Optional. */
    style?: React.CSSProperties;
}

/**
 * State for the BootstrapIcon component. Currently empty.
 */
interface State { }

/**
 * BootstrapIcon component that renders Bootstrap icons.
 */
export class BootstrapIcon extends React.Component<Props, State> {
    /**
     * Renders the Bootstrap icon.
     * @returns The Bootstrap icon element.
     */
    public render(): React.ReactNode {
        let css: React.CSSProperties = { ...BootstrapIconTheme(this.props.size) };
        css = { ...css, ...this.props.style };
        if (this.props.color)
            css = { ...css, color: this.props.color };

        return <i
            style={css}
            className={("bi-" + this.props.name + " " + this.props.className).trim()}
        ></i>;
    }
}
