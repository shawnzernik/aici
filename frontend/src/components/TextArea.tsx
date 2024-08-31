import React, { ChangeEventHandler, CSSProperties, ReactNode } from "react";
import { Theme } from "../Theme";

interface Props {
    onChange: ChangeEventHandler<HTMLTextAreaElement> | undefined;
    value: string;
    style?: CSSProperties;
}

export function TextArea(props: Props): React.ReactElement {
    return <textarea style={{ ...Theme.TextArea, ...props.style }} onChange={props.onChange} value={props.value} />
}