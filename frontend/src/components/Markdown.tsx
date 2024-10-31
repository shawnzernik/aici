import * as React from "react";
import { MarkdownTheme } from "./MarkdownTheme";
import { marked } from "marked";

interface Props {
    children: string;
    page: any;
}

/**
 * A React component that renders markdown content with code blocks
 * that can be copied to the clipboard.
 */
export class Markdown extends React.Component<Props> {

    /**
     * Copies the provided text to the clipboard and displays a message
     * using the page event system.
     * 
     * @param text - The text to be copied to the clipboard.
     */
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
                console.error('Failed to copy: ', err);
            });
    }

    /**
     * Binds the click event to all code blocks for copying functionality.
     */
    private bindCopyToCodeBlocks(): void {
        const codeBlocks = document.querySelectorAll('pre code');
        codeBlocks.forEach((codeBlock) => {
            codeBlock.addEventListener('click', () => {
                const text = codeBlock.textContent || '';
                this.copyToClipboard(text);
            });
        });
    }

    /**
     * Unbinds the click event from all code blocks.
     */
    private unbindCopyFromCodeBlocks(): void {
        const codeBlocks = document.querySelectorAll('pre code');
        codeBlocks.forEach((codeBlock) => {
            codeBlock.replaceWith(codeBlock.cloneNode(true));
        });
    }

    /**
     * Binds the copy event to code blocks when the component is mounted.
     */
    public componentDidMount(): void {
        this.bindCopyToCodeBlocks();
    }

    /**
     * Binds and unbinds the copy event to code blocks when the component updates.
     */
    public componentDidUpdate(): void {
        this.unbindCopyFromCodeBlocks();
        this.bindCopyToCodeBlocks();
    }

    /**
     * Unbinds the copy event from code blocks when the component is unmounted.
     */
    public componentWillUnmount(): void {
        this.unbindCopyFromCodeBlocks();
    }

    /**
     * Renders the component by converting markdown content to HTML.
     * 
     * @returns The rendered component.
     */
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
