import * as React from "react";
import { CheckboxTheme } from "./CheckboxTheme";

/**
 * Interface for the component props.
 */
interface Props {
    /** Optional prop to enable password mode. */
    password?: boolean;
    /** Optional prop to make the checkbox read-only. */
    readonly?: boolean;
    /** Optional prop to set the initial checked state. */
    checked?: boolean;
    /** Optional callback function that is called when the checkbox state changes. */
    onChange?: (value: boolean) => void;
}

/**
 * Interface for the component state.
 */
interface State {
    /** Holds the current value of the checkbox. */
    value: boolean;
}

/**
 * Checkbox component.
 */
export class Checkbox extends React.Component<Props, State> {
    /**
     * Represents the Checkbox component.
     * @param props - The component props.
     */
    public constructor(props: Props) {
        super(props);
    }

    /**
     * Renders the checkbox input element.
     * @returns The rendered checkbox element.
     */
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
