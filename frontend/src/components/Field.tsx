import * as React from "react";
import { FieldTheme } from "./FieldTheme";
import { Theme } from "./Theme";

/**
 * The properties for the Field component.
 */
interface Props {
    /**
     * The content to be rendered inside the Field.
     */
    children?: React.ReactNode;
    /**
     * The label for the Field.
     */
    label?: string;
    /**
     * The size of the Field, determines its width.
     */
    size?: number;
}

/**
 * The state interface for the Field component.
 */
interface State { }

/**
 * Field component renders a labeled field, optionally sized, with children content.
 */
export class Field extends React.Component<Props, State> {

    /**
     * Renders the Field component.
     * @returns The rendered Field component.
     */
    public render(): React.ReactNode {
        return (
            <div style={{
                ...FieldTheme.field,
                width: this.props.size ? (this.props.size + 1) * Theme.FormLabelWidthEm + "em" : "100%"
            }}>
                <span style={FieldTheme.fieldLabel}>{this.props.label && this.props.label.length ? this.props.label + ":" : ""}</span>
                {this.props.children}
            </div>
        );
    }
}
