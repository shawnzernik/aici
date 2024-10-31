import * as React from "react";

/**
 * The props for the SelectOption component.
 */
interface Props {
    /** The value of the option. */
    value: string;
    /** The display text of the option. */
    display: string;
}

/** 
 * The state for the SelectOption component. 
 */
interface State { }

/**
 * A component that represents a selectable option in a dropdown.
 */
export class SelectOption extends React.Component<Props, State> {
    /**
     * Renders the option element.
     * @returns The rendered option element.
     */
    public render(): React.ReactNode {
        return <option value={this.props.value}>{this.props.display}</option>
    }
}
