import { CSSProperties, MouseEventHandler } from "react";
import { Theme } from "../Theme";

interface Props {
    name: string;
    label: string;
    active: string;
    onClick: MouseEventHandler<HTMLDivElement> | undefined;
}

export function Tab(props: Props) {
    let divStyle: CSSProperties = Theme.Tab;
    let spanStyle: CSSProperties = Theme.TabLabel;

    if(props.active === props.name) {
        divStyle = {...divStyle, ...Theme.TabActive};
        spanStyle = {...spanStyle, ...Theme.TabLabelActive}
    }

    return <div style={divStyle} onClick={props.onClick}><span style={spanStyle}>{props.label}</span></div>
}