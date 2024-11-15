import * as React from "react";
import { FieldTheme } from "./FieldTheme";
import { Theme } from "./Theme";

interface Props {
    children?: React.ReactNode;
    label?: string;
    size?: number;
}

interface State { }

export class Field extends React.Component<Props, State> {

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
