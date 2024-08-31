import React, { ChangeEventHandler, CSSProperties, ReactNode } from "react";
import { Theme } from "../Theme";

interface Props {
    onChange: ChangeEventHandler<HTMLInputElement> | undefined;
    value: string;
}

export function Input(props: Props): React.ReactElement {    
    return <input style={Theme.FormFieldInput} onChange={props.onChange} value={props.value} />
}