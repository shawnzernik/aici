import React, { CSSProperties } from "react";

interface Props {
    img: string;
    style: CSSProperties | undefined;
    label?: string;
}

export function Icon(props: Props): React.ReactElement {
    if(props.label)
        return <div className={"bi bi-" + props.img} style={props.style}>&nbsp;{props.label}</div>;

    return <div className={"bi bi-" + props.img} style={props.style} />;
}