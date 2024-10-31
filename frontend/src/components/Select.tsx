import * as React from "react";
import { SelectTheme } from "./SelectTheme";
import { Theme } from "./Theme";

interface Props {
    /** Indicates whether the select is a password field. */
    password?: boolean;
    /** Indicates whether the select is read-only. */
    readonly?: boolean;
    /** The value of the select element. */
    value?: string;
    /** Callback function that is called when the value of the select changes. */
    onChange?: (value: string) => void;
    /** The options for the select element. */
    children?: React.ReactNode[];
}

interface State { }

/** 
 * A custom select component that supports themes, 
 * password mode, and read-only mode. 
 */
export class Select extends React.Component<Props, State> {
    /** 
     * Creates an instance of Select. 
     * @param props - The props for the component. 
     */
    public constructor(props: Props) {
        super(props);
    }

    /** 
     * Renders the select element. 
     * @returns The rendered select element. 
     */
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
