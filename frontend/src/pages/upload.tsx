import * as React from "react";
import { createRoot } from "react-dom/client";
import { Dialogue, ErrorMessage, Navigation } from "../components/Navigation";
import { BasePage, BasePageState } from "../components/BasePage";
import { Markdown } from "../components/Markdown";
import { Heading } from "../components/Heading";
import { Form } from "../components/Form";
import { Field } from "../components/Field";
import { FlexRow } from "../components/FlexRow";
import { Button } from "../components/Button";
import { AuthService } from "../services/AuthService";
import { AiciService } from "../services/AiciService";

interface Props { }

/**
 * Upload page state interface
 */
interface State extends BasePageState {
    file: File | null;        // Selected file for upload
    corelation: string | null; // Corelation ID after successful upload
    logs: string | null;      // Logs for display
}

/**
 * Upload Page Class
 */
class Page extends BasePage<Props, State> {
    private interval: NodeJS.Timeout | null; // Interval for uploading logs

    /**
     * Constructor for Page
     * @param props Component props
     */
    public constructor(props: Props) {
        super(props);

        this.state = {
            ...BasePage.defaultState,
            file: null,
            corelation: null,
            logs: null,
        };
    }

    /**
     * Periodically uploads logs to the server
     */
    private async uploadLogInterval() {
        const token = await AuthService.getToken();
        const logs = await AiciService.uploadLogs(token, this.state.corelation!);

        let logContent = "| Level | Time | Message |\n";
        logContent += "|---|---|---|\n"
        logs.forEach((log) => {
            if (log.message)
                logContent += `|${log.level}|${log.epoch.replace(/"/g, "")}|${log.message.replace(/\n/g, " ")}|\n`;
        });

        if (logContent.includes("ALL DONE!")) {
            clearInterval(this.interval);
            await Dialogue(this, "Done", "The dataset and vector DB have been updated.");
        }

        await this.updateState({ logs: logContent })
        await this.events.setLoading(false);
    }

    /**
     * Handles upload button click
     */
    private async uploadClicked() {
        try {
            await this.events.setLoading(true);

            if (!this.state.file)
                throw new Error("No file selected!");

            const token = await AuthService.getToken();
            const corelation = await AiciService.upload(token, this.state.file);
            await this.updateState({ corelation: corelation });

            this.interval = setInterval(this.uploadLogInterval.bind(this), 5 * 1000);
        }
        catch (err) {
            ErrorMessage(this, err);
        }
    }

    /**
     * Renders the component
     * @returns JSX to render
     */
    public render(): React.ReactNode {
        return (
            <Navigation
                state={this.state} events={this.events}
                topMenuGuid="a4b3b92f-3037-4780-a5c2-3d9d85d6b5a4"
                leftMenuGuid="720fa4c9-20d0-407d-aff6-3dad45d155cc"
            >
                <Heading level={1}>Upload Source Code</Heading>
                <p>Please upload a ZIP file - preferably from a GIT repo.  We will process the code by first asking the AI model to explain the code - this will be used for fine tuning.  Secondly, we'll generate embeddings for the file.</p>
                <Form>
                    <Field label="ZIP File"><input
                        type="file"
                        onChange={(e) => {
                            this.setState({
                                file: e.target.files?.item(0) || null
                            });
                        }}
                    /></Field>
                    <FlexRow gap="1em">
                        <Button label="Upload" onClick={this.uploadClicked.bind(this)} />
                    </FlexRow>
                </Form>

                {
                    this.state.logs
                        ? <>
                            <Heading level={2}>Logs</Heading>
                            <Markdown page={this}>{this.state.logs}</Markdown>
                        </>
                        : <></>
                }
            </Navigation>
        );
    }
}

/**
 * Window onload event to start the application
 */
window.onload = () => {
    const element = document.getElementById('root');
    const root = createRoot(element);
    root.render(<Page />)
};

/**
 * Window onpageshow event to reload if persisted
 * @param event 
 */
window.onpageshow = (event) => {
    if (event.persisted) {
        window.location.reload();
    }
};
