import React, { CSSProperties, ReactNode } from "react";
import { Theme } from "../Theme";

interface Props {
    style?: CSSProperties;
    children?: ReactNode;
}

export function Form(props: Props): React.ReactElement {    
    return (
        <div style={{...Theme.Form, ...props.style}}>
            {props.children}
        </div>
    );
}