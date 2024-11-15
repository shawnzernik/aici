import * as React from "react";
import { MarkdownTheme } from "./MarkdownTheme";
import { marked } from "marked";

interface Props {
    children: string;
    page: any;
}

export class Markdown extends React.Component<Props> {

    private copyToClipboard(text: string): void {
        navigator.clipboard.writeText(text)
            .then(() => {
                return this.props.page.events.setMessage({
                    title: "Copied",
                    content: "The code has been copied to the clipboard.",
                    buttons: [{
                        label: "OK"
                    }]
                });
            })
            .catch(err => {
                console.error("Failed to copy: ", err);
            });
    }

    private bindCopyToCodeBlocks(): void {
        const codeBlocks = document.querySelectorAll("pre code");
        codeBlocks.forEach((codeBlock) => {
            codeBlock.addEventListener("click", () => {
                const text = codeBlock.textContent || "";
                this.copyToClipboard(text);
            });
        });
    }

    private unbindCopyFromCodeBlocks(): void {
        const codeBlocks = document.querySelectorAll("pre code");
        codeBlocks.forEach((codeBlock) => {
            codeBlock.replaceWith(codeBlock.cloneNode(true));
        });
    }

    public componentDidMount(): void {
        this.bindCopyToCodeBlocks();
    }

    public componentDidUpdate(): void {
        this.unbindCopyFromCodeBlocks();
        this.bindCopyToCodeBlocks();
    }

    public componentWillUnmount(): void {
        this.unbindCopyFromCodeBlocks();
    }

    public render(): React.ReactNode {
        marked.setOptions({
            gfm: true
        });
        return (
            <div
                className="marked"
                style={MarkdownTheme}
                dangerouslySetInnerHTML={{ __html: marked(this.props.children) }}
            />
        );
    }
}
