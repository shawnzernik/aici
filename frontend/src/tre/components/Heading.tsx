import * as React from "react";
import { HeadingTheme } from "./HeadingTheme";

interface Props {
    children: React.ReactNode;
    level: 1 | 2 | 3 | 4 | 5 | 6;
}

interface State { }

export class Heading extends React.Component<Props, State> {
    public render(): React.ReactNode {
        return <span style={HeadingTheme(this.props.level)}>{this.props.children}</span>
    }
}