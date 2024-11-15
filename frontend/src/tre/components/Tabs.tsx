import * as React from "react";
import { Dictionary } from "common/src/tre/Dictionary";
import { TabsTheme } from "./TabsTheme";

interface Props {
    components: Dictionary<React.ReactElement>;
}

interface State {
    activeLabel: string;
}

export class Tabs extends React.Component<Props, State> {
    public async setTab(name: string) {
        this.setState({ activeLabel: name });
    }

    public constructor(props: Props) {
        super(props);

        const labels = Object.keys(this.props.components);

        if (labels.length < 1)
            throw new Error("You must provide at least one tab component!");

        this.state = { activeLabel: labels[0] };
    }

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
