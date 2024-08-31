import React, { ChangeEventHandler, CSSProperties, ReactNode } from "react";
import { Theme } from "../Theme";
import { Dictionary } from "../models/Dictionary";

interface Props {
    onChange: ChangeEventHandler<HTMLSelectElement> | undefined;
    value: string;
    options: Dictionary<string>;
}

export function Select(props: Props): React.ReactElement {    
    const options: React.ReactElement[] = [];
    Object.keys(props.options).forEach((key) => {
        options.push(<option value={key}>{props.options[key]}</option>)
    });

    return <select style={Theme.FormFieldSelect} onChange={props.onChange} value={props.value}>{options}</select>
}