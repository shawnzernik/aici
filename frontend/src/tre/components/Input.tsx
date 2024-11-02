import * as React from "react";
import { InputTheme } from "./InputTheme";

/**
 * Input component props interface
 */
interface Props {
    /** Indicates if the input should be of type password */
    password?: boolean;
    /** Indicates if the input is read-only */
    readonly?: boolean;
    /** Value of the input */
    value?: string;
    /** Callback function called when the input value changes */
    onChange?: (value: string) => void;
}

/** 
 * Input component state interface 
 */
interface State { }

/**
 * Input component class
 */
export class Input extends React.Component<Props, State> {
    /**
     * Constructor for the Input component
     * @param props - The props for the component
     */
    public constructor(props: Props) {
        super(props);
    }

    /**
     * Renders the input element
     * @returns The rendered input element
     */
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
