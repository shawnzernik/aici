import * as React from "react";
import { FlexRowTheme } from "./FlexRowTheme";
import { CSSProperties } from "react";

interface Props {
    children?: React.ReactNode;
    gap?: string;
    style?: CSSProperties;
}

/**
 * Component State Interface
 */
interface State { }

/**
 * FlexRow Component
 */
export class FlexRow extends React.Component<Props, State> {
    /**
     * Constructor for FlexRow component
     * @param props - Component props
     */
    public constructor(props: Props) {
        super(props);
    }

    /**
     * Renders the FlexRow component
     * @returns React.ReactNode
     */
    public render(): React.ReactNode {
        let style: CSSProperties = { ...FlexRowTheme, ...this.props.style };
        if (this.props.gap)
            style = { ...style, gap: this.props.gap }

        return <div style={style}>{this.props.children}</div>;
    }
}
