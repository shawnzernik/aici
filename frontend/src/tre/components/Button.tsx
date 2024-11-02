import * as React from "react";
import { ButtonTheme } from "./ButtonTheme";

/**
 * Interface for the component props.
 */
interface Props {
    /** The label of the button. */
    label: string;
    /** Optional click handler for the button. */
    onClick?: () => void;
}

/**
 * Interface for the component state.
 */
interface State { }

/**
 * Button component.
 */
export class Button extends React.Component<Props, State> {
    /** 
     * Renders the button component.
     * @returns The rendered button element. 
     */
    public render(): React.ReactNode {
        return <button
            style={ButtonTheme}
            onClick={this.props.onClick}
        >{this.props.label}</button>;
    }
}
