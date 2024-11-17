import * as React from "react";
import { InputTheme } from "./InputTheme";

interface Props {
    password?: boolean;
    readonly?: boolean;
    value?: Date;
    onChange?: (value: Date) => void;
}

interface State { }

export class DateTime extends React.Component<Props, State> {
    public constructor(props: Props) {
        super(props);
    }

    public render(): React.ReactNode {
        const value = new Date(this.props.value ? this.props.value : "");

        return <>
            <input
                type="date"
                style={{
                    ...InputTheme,
                    flexGrow: 10,
                    flexShrink: 10,
                    flexBasis: 10
                }}
                value={value.toISOString()}
                onChange={(e) => {
                    if (this.props.readonly)
                        return;
                    if (this.props.onChange) {
                        let date =
                            this.props.value.getFullYear() + "-" +
                            this.props.value.getMonth() + "-" +
                            this.props.value.getDay() + " " +
                            e.target.value;
                    }
                }}
            />
            <input
                type="time"
                style={{
                    ...InputTheme,
                    flexGrow: 8,
                    flexShrink: 8,
                    flexBasis: 8
                }}
                value={value.toDateString()}
                onChange={(e) => {
                    if (this.props.readonly)
                        return;
                    if (this.props.onChange) {
                        let date =
                            e.target.value + " " +
                            this.props.value.getHours() + ":" +
                            this.props.value.getMinutes() + ":" +
                            this.props.value.getSeconds() + "." +
                            this.props.value.getMilliseconds();
                    }
                }}
            />
        </>;
    }
}
