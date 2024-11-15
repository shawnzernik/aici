import * as React from "react";

interface Props {
    value: string;
    display: string;
}

interface State { }

export class SelectOption extends React.Component<Props, State> {
    public render(): React.ReactNode {
        return <option value={this.props.value}>{this.props.display}</option>
    }
}
