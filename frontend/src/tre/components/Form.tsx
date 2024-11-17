import * as React from "react";
import { FormTheme } from "./FormTheme";

export interface UploadedFile {
    name: string;
    mimetype: string;
    contents: string;
}

interface Props {
    page?: any;
    children?: React.ReactNode;
    fileUploaded?: (files: FileList) => void;
}

interface State {
    highlighted: boolean;
}

export class Form extends React.Component<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            highlighted: false
        };
    }

    public render(): React.ReactNode {
        let styles: React.CSSProperties = {};
        if (this.state.highlighted)
            styles = { backgroundColor: "#ffd" };
        else
            styles = {};

        let div;
        if (this.props.fileUploaded) {
            if (!this.props.page)
                throw new Error("Form taking upload must take page!");

            div = <div
                onDragEnter={(e) => {
                    e.preventDefault();
                    this.setState({ highlighted: true });
                }}
                onDragOver={(e) => {
                    e.preventDefault();
                    this.setState({ highlighted: true });
                }}
                onDragLeave={(e) => {
                    e.preventDefault();
                    this.setState({ highlighted: false });
                }}
                onDrop={async (e) => {
                    e.preventDefault();
                    this.setState({ highlighted: false });

                    this.props.fileUploaded(e.dataTransfer.files);
                }}
                style={{ ...FormTheme, ...styles }
                }
            > {this.props.children}</div >;
        } else {
            div = <div
                style={{ ...FormTheme, ...styles }}
            >{this.props.children}</div>;
        }
        return div;
    }
}