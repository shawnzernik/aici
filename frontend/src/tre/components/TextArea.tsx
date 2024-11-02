import * as React from "react";
import { TextAreaTheme } from "./TextAreaTheme";
import { CSSProperties } from "react";

interface Props {
    id?: string;                       // Optional id for the textarea element
    password?: boolean;               // Optional flag to indicate if the textarea should be treated as a password field
    readonly?: boolean;               // Optional flag to make the textarea read-only
    value?: string;                   // Optional value for the textarea
    monospace?: boolean;              // Optional flag to apply monospace font
    rows?: number;                    // Optional number of rows for the textarea
    onChange?: (value: string) => void; // Optional callback function fired on value change
    style?: CSSProperties;            // Optional additional style for the textarea
    showAll?: boolean;                // Optional flag to show all content
}

interface State { }

/**
 * TextArea component is a customizable textarea element
 */
export class TextArea extends React.Component<Props, State> {
    private textAreaRef: React.RefObject<HTMLTextAreaElement>; // Reference to the textarea element

    /**
     * Constructor to initialize the TextArea component
     * @param props - Component props
     */
    public constructor(props: Props) {
        super(props);
        this.textAreaRef = React.createRef();
    }

    /**
     * Render method to display the textarea
     * @returns React.ReactNode
     */
    public render(): React.ReactNode {
        let style: CSSProperties = {
            ...TextAreaTheme,
            ...this.props.style
        };

        if (this.props.monospace) {
            style = {
                ...style,
                fontFamily: "MonoText"
            };
        }

        // If rows are defined and showAll is not enabled, set height based on rows
        if (this.props.rows && !this.props.showAll) {
            style = {
                ...style,
                height: `${this.props.rows * 1.25 + 1}em`
            };
        }

        const lines = this.props.value?.split("\n").length || 0;
        if (this.props.showAll) {
            style = {
                ...style,
                height: `${lines * 1.35 + 10}em`
            };
        }

        return (
            <textarea
                wrap="off"
                id={this.props.id}
                ref={this.textAreaRef}
                style={style}
                value={this.props.value ? this.props.value : ""}
                readOnly={this.props.readonly}
                onChange={(e) => {
                    if (this.props.onChange) {
                        this.props.onChange(e.target.value);
                    }
                }}
            ></textarea>
        );
    }
}
