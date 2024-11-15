import * as React from "react";
import { InputTheme } from "./InputTheme";

interface Props {
    password?: boolean;
    readonly?: boolean;
    value?: string;
    onChange?: (value: string) => void;
}

interface State { }

export class Input extends React.Component<Props, State> {
    public constructor(props: Props) {
        super(props);
    }

    public render(): React.ReactNode {
        return <input
            type={this.props.password ? "password" : "text"}
            style={InputTheme}
            value={this.props.value ? this.props.value : ""}
            onChange={(e) => {
                if (this.props.readonly)
                    return;
                if (this.props.onChange)
                    this.props.onChange(e.target.value);
            }}
        />;
    }
}
