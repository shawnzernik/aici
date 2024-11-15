import * as React from "react";
import { FlexRowTheme } from "./FlexRowTheme";
import { CSSProperties } from "react";

interface Props {
    children?: React.ReactNode;
    gap?: string;
    style?: CSSProperties;
}

interface State { }

export class FlexRow extends React.Component<Props, State> {
    public constructor(props: Props) {
        super(props);
    }

    public render(): React.ReactNode {
        let style: CSSProperties = { ...FlexRowTheme, ...this.props.style };
        if (this.props.gap)
            style = { ...style, gap: this.props.gap }

        return <div style={style}>{this.props.children}</div>;
    }
}
