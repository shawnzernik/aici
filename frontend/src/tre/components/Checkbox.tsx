import * as React from "react";
import { CheckboxTheme } from "./CheckboxTheme";

interface Props {
    password?: boolean;
    readonly?: boolean;
    checked?: boolean;
    onChange?: (value: boolean) => void;
}

interface State {
    value: boolean;
}

export class Checkbox extends React.Component<Props, State> {
    public constructor(props: Props) {
        super(props);
    }

    public render(): React.ReactNode {
        return <input
            type="checkbox"
            style={CheckboxTheme}
            checked={this.props.checked}
            readOnly={this.props.readonly}
            onChange={(e) => {
                if (this.props.onChange)
                    this.props.onChange(e.target.checked);
            }}
        />;
    }
}
