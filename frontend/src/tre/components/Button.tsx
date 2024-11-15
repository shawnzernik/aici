import * as React from "react";
import { ButtonTheme } from "./ButtonTheme";

interface Props {
    label: string;
    onClick?: () => void;
}

interface State { }

export class Button extends React.Component<Props, State> {
    public render(): React.ReactNode {
        return <button
            style={ButtonTheme}
            onClick={this.props.onClick}
        >{this.props.label}</button>;
    }
}