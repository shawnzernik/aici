import React, { CSSProperties, ReactNode } from "react";
import { Theme } from "../Theme";

interface Props {
    size: number;
    children?: ReactNode;
    label: string;
    style?: CSSProperties;
}

export function Field(props: Props): React.ReactElement {
    return (
        <div style={{ ...Theme.FormField(props.size), ...props.style }}>
            <span style={Theme.FormFieldLabel}>{props.label}:</span>
            {props.children}
        </div>
    );
}