import * as React from "react";
import { SelectTheme } from "./SelectTheme";
import { Theme } from "./Theme";

interface Props {
    password?: boolean;
    readonly?: boolean;
    value?: string;
    onChange?: (value: string) => void;
    children?: React.ReactNode[];
}

interface State { }

export class Select extends React.Component<Props, State> {
    public constructor(props: Props) {
        super(props);
    }

    public render(): React.ReactNode {
        return <select
            style={SelectTheme}
            value={this.props.value ? this.props.value : ""}
            onChange={(e) => {
                if (this.props.readonly)
                    return;

                if (this.props.onChange)
                    this.props.onChange(e.target.value);
            }}
        >
            {this.props.children}
        </select>;
    }
}