import * as React from "react";
import { HeadingTheme } from "./HeadingTheme";

/**
 * Props for the Heading component.
 */
interface Props {
    /** The content to be displayed inside theHeading. */
    children: React.ReactNode;
    /** The level of the heading, determines theHeading's size. */
    level: 1 | 2 | 3 | 4 | 5 | 6;
}

/** 
 * State for the Heading component. 
 * Currently unused, but can be used for future enhancements.
 */
interface State { }

/**
 * Heading component that renders a heading element based on the specified level.
 */
export class Heading extends React.Component<Props, State> {
    /** 
     * Renders the heading element.
     * Applies theHeadingTheme based on the level prop.
     * 
     * @returns The renderedHeading element.
     */
    public render(): React.ReactNode {
        return <span style={HeadingTheme(this.props.level)}>{this.props.children}</span>
    }
}
