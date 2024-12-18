import * as React from "react";
import { createRoot } from "react-dom/client";
import { Dialogue, ErrorMessage, Navigation } from "../../tre/components/Navigation";
import { BasePage, BasePageState } from "../../tre/components/BasePage";
import { Markdown } from "../../tre/components/Markdown";
import { TextArea } from "../../tre/components/TextArea";
import { FlexRow } from "../../tre/components/FlexRow";
import { Button } from "../../tre/components/Button";
import { Message as AiciMessage } from "common/src/app/models/Message";
import { AiciService } from "../services/AiciService";
import { Theme } from "../../tre/components/Theme";
import { DatasetService } from "../services/DatasetService";
import { Tabs } from "../../tre/components/Tabs";
import { UUIDv4 } from "common/src/tre/logic/UUIDv4";
import { AuthService } from "../../tre/services/AuthService";
import { DatasetDto } from "common/src/app/models/DatasetDto";
import { PromptDto } from "common/src/app/models/PromptDto";
import { PromptService } from "../services/PromptService";

interface Props { }

interface State extends BasePageState {
    messages: AiciMessage[];
    user: string;
    inputTokens: number;
    outputTokens: number;
    seconds: number;
}

class Page extends BasePage<Props, State> {
    private static defaultMessages: AiciMessage[] = [
    ];

    public constructor(props: Props) {
        super(props);

        this.state = {
            ...BasePage.defaultState,
            messages: Page.defaultMessages,
            user: "",
            inputTokens: 0,
            outputTokens: 0,
            seconds: 0
        }
    }

    public async componentDidMount(): Promise<void> {
        const resend = window.localStorage.getItem("Page.resendClicked");
        if (!resend)
            return;

        window.localStorage.removeItem("Page.resendClicked");

        const resendMessages = JSON.parse(resend) as AiciMessage[];
        const newMessages: AiciMessage[] = [];

        for (let cnt = 0; cnt < resendMessages.length - 1; cnt++) {
            newMessages.push(resendMessages[cnt]);
        }

        await this.updateState({
            messages: newMessages,
            user: resendMessages[resendMessages.length - 1].content
        });
    }

    private async resetClicked() {
        await this.updateState({
            messages: Page.defaultMessages,
            user: ""
        })
    }

    private async submitClicked() {
        try {
            await this.events.setLoading(true);

            let newMessages = this.jsonCopy(this.state.messages) as AiciMessage[];
            newMessages.push({
                role: "user",
                content: this.state.user
            });

            await this.updateState({
                messages: newMessages,
                user: ""
            });

            const token = await AuthService.getToken();

            const started = Date.now();
            let response = await AiciService.chat(token, newMessages);
            const ended = Date.now();

            newMessages.push(response.choices[0].message);

            await this.updateState({
                inputTokens: response.usage.prompt_tokens,
                outputTokens: response.usage.total_tokens,
                seconds: (ended - started) / 1000,
                messages: newMessages
            });

            await this.events.setLoading(false);
        }
        catch (err) {
            await ErrorMessage(this, err);
            await this.events.setLoading(false);
        }
    }

    private async saveDatasetClicked() {
        try {
            await this.events.setLoading(true);

            const dto: DatasetDto = {
                guid: UUIDv4.generate(),
                includeInTraining: false,
                isUploaded: false,
                title: Date.now().toString(),
                json: JSON.stringify(this.state.messages)
            };

            const token = await AuthService.getToken();
            await DatasetService.save(token, dto);

            await this.events.setLoading(false);
            await Dialogue(this, "Saved", "The conversation has been saved to datasets!");
        }
        catch (err) {
            await ErrorMessage(this, err);
            await this.events.setLoading(false);
        }
    }

    private async savePromptClicked() {
        try {
            await this.events.setLoading(true);

            const dto: PromptDto = {
                guid: UUIDv4.generate(),
                title: Date.now().toString(),
                json: JSON.stringify(this.state.messages),
                input: ""
            };

            const token = await AuthService.getToken();
            await PromptService.save(token, dto);

            await this.events.setLoading(false);
            await Dialogue(this, "Saved", "The conversation has been saved to prompts!");
        }
        catch (err) {
            await ErrorMessage(this, err);
            await this.events.setLoading(false);
        }
    }

    public render(): React.ReactNode {
        let markdown = "# Conversation\n\n";
        if (this.state.messages && this.state.messages.length > 0) {
            this.state.messages.forEach((msg) => {
                markdown += `\n`;
                if (msg.role === "user")
                    markdown += `## User\n`;
                else
                    markdown += `## Assistant\n`;
                markdown += `\n`;
                markdown += `\n`;
                markdown += msg.content + "\n";
            });
        }

        return (
            <Navigation
                state={this.state} events={this.events}
                topMenuGuid="a4b3b92f-3037-4780-a5c2-3d9d85d6b5a4"
                leftMenuGuid="b3d886a8-dd3d-426a-9ddf-1e18cbb7e224"
            >
                <Tabs
                    components={{
                        "Send Message":
                            <div
                                style={{ display: "flex", flexDirection: "column", gap: "1em", height: "calc(100vh - 12em)" }}
                            >
                                <div></div>
                                <TextArea
                                    style={{ flexGrow: "1", flexShrink: "1", height: "100%" }}
                                    monospace={true}
                                    value={this.state.user}
                                    onChange={async (value) => {
                                        await this.updateState({ user: value });
                                    }}
                                ></TextArea>
                                <FlexRow
                                    gap="1em"
                                    style={{ flexGrow: "0", flexShrink: "0" }}
                                >
                                    <Button label="Submit" onClick={this.submitClicked.bind(this)} />
                                    <Button label="Reset" onClick={this.resetClicked.bind(this)} />
                                    <Button label="Save Dataset" onClick={this.saveDatasetClicked.bind(this)} />
                                    <Button label="Save Prompt" onClick={this.savePromptClicked.bind(this)} />
                                </FlexRow>
                            </div>,
                        "Conversation": <>
                            <div style={{
                                width: "100%",
                                overflow: "auto"
                            }}>
                                <Markdown page={this}>{markdown}</Markdown>
                            </div>
                            <FlexRow gap="1em" style={{
                                borderTop: "1pt solid " + Theme.mediumText,
                                paddingTop: "1em"
                            }}>
                                <span>Input: {this.state.inputTokens}</span>
                                <span>New: {this.state.outputTokens - this.state.inputTokens}</span>
                                <span>Output: {this.state.outputTokens}</span>
                                <span>Seconds: {this.state.seconds.toFixed(2)}</span>
                                <span>T/S: {(this.state.outputTokens / this.state.seconds).toFixed(2)}</span>
                            </FlexRow>
                        </>
                    }}
                />
            </Navigation>
        );
    }
}

window.onload = () => {
    const element = document.getElementById("root");
    const root = createRoot(element);
    root.render(<Page />)
};
window.onpageshow = (event) => {
    if (event.persisted) {
        window.location.reload();
    }
};