import * as React from "react";
import { ButtonTheme } from "./ButtonTheme";
import { FormTheme } from "./FormTheme";

/**
 * Interface for component props.
 */
interface Props {
    children?: React.ReactNode;
}

/**
 * Interface for component state.
 */
interface State { }

/**
 * Form component class.
 */
export class Form extends React.Component<Props, State> {
    /**
     * Renders the form component.
     * @returns The rendered form component.
     */
    public render(): React.ReactNode {
        return <div style={FormTheme}>{this.props.children}</div>;
    }
}
