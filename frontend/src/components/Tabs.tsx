import * as React from "react";
import { Dictionary } from "common/src/Dictionary";
import { TabsTheme } from "./TabsTheme";

// Interface for component props
interface Props {
    /** 
     * A dictionary where keys are tab labels and values are React elements. 
     * Each entry represents a tab.
     */
    components: Dictionary<React.ReactElement>;
}

// Interface for component state
interface State {
    /** 
     * The label of the currently active tab. 
     * Determines which component is visible.
     */
    activeLabel: string;
}

export class Tabs extends React.Component<Props, State> {
    /** 
     * Creates an instance of Tabs. 
     * Initializes the state with the first tab label.
     * @param props - The props object containing component data.
     * @throws Error if no tab components are provided.
     */
    public constructor(props: Props) {
        super(props);

        const labels = Object.keys(this.props.components);

        if (labels.length < 1)
            throw new Error("You must provide at least one tab component!");

        this.state = { activeLabel: labels[0] };
    }

    /** 
     * Renders the component. 
     * Creates tab labels and sets the active tab style.
     * @returns The JSX representation of the Tabs component.
     */
    public render(): React.ReactNode {
        const labelDivs: React.ReactElement[] = [];
        const labels = Object.keys(this.props.components);
        for (let label of labels) {
            const isActive = this.state.activeLabel === label;
            labelDivs.push(
                <>
                    <span
                        onClick={() => {
                            this.setState({ activeLabel: label });
                        }}
                        style={isActive ? TabsTheme.tabActive : TabsTheme.tabInactive}
                    >
                        {label}
                    </span>
                    <span style={TabsTheme.space}>&nbsp;</span>
                </>
            );
        }

        const visibleComponent = this.props.components[this.state.activeLabel];

        return (
            <div style={TabsTheme.tabContainer}>
                <div style={TabsTheme.tabRowContainer}>
                    <span style={TabsTheme.space}>&nbsp;</span>
                    {labelDivs}
                    <span style={TabsTheme.spaceGrow}>&nbsp;</span>
                </div>
                <div>
                    {visibleComponent}
                </div>
            </div>
        );
    }
}
