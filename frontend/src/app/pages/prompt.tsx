import * as React from "react";
import { createRoot } from "react-dom/client";
import { Dialogue, ErrorMessage, Navigation } from "../../tre/components/Navigation";
import { BasePage, BasePageState } from "../../tre/components/BasePage";
import { Heading } from "../../tre/components/Heading";
import { Form } from "../../tre/components/Form";
import { Field } from "../../tre/components/Field";
import { Message as AiciMessage } from "common/src/app/models/Message";
import { PromptDto } from "common/src/app/models/PromptDto";
import { UUIDv4 } from "common/src/tre/logic/UUIDv4";
import { Input } from "../../tre/components/Input";
import { TextArea } from "../../tre/components/TextArea";
import { Button } from "../../tre/components/Button";
import { AiciService } from "../services/AiciService";
import { EmbeddingLogic } from "../logic/EmbeddingLogic";
import { Markdown } from "../../tre/components/Markdown";
import { Tabs } from "../../tre/components/Tabs";
import { FlexRow } from "../../tre/components/FlexRow";
import { DatasetDto } from "common/src/app/models/DatasetDto";
import { DatasetService } from "../services/DatasetService";
import { AuthService } from "../../tre/services/AuthService";
import { PromptService } from "../services/PromptService";

interface Props { }

interface State extends BasePageState {
    model: PromptDto;
    messages: AiciMessage[];
    output: string;
    values: string;
    status: string;
    embeddingLogic: EmbeddingLogic | null;
}

class Page extends BasePage<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            ...BasePage.defaultState,
            model: {
                guid: UUIDv4.generate(),
                title: "",
                json: "",
                input: ""
            },
            messages: [{ role: "user", content: "" }, { role: "assistant", content: "" }],
            output: "",
            values: "",
            status: "Not started",
            embeddingLogic: null
        };
    }

    public async componentDidMount(): Promise<void> {
        try {
            await this.events.setLoading(true);

            const guid = this.queryString("guid");
            if (!guid)
                return;

            const token = await AuthService.getToken();
            const prompt = await PromptService.get(token, guid);
            const messages = JSON.parse(prompt.json) as AiciMessage[];

            await this.updateState({
                messages: messages,
                model: prompt
            });

            await this.events.setLoading(false);
        }
        catch (err) {
            await ErrorMessage(this, err);
        }
    }

    private async removeClicked(target: number): Promise<void> {
        await this.events.setLoading(true);

        let newMessages: AiciMessage[] = [];

        this.state.messages.forEach((msg, index) => {
            if (target !== index)
                newMessages.push(msg);
        });

        const newPrompt = this.jsonCopy(this.state.model);
        newPrompt.json = JSON.stringify(newMessages);

        await this.updateState({
            model: newPrompt,
            messages: newMessages
        });

        await this.events.setLoading(false);
    }

    private async saveClicked(): Promise<void> {
        try {
            await this.events.setLoading(true);

            const token = await AuthService.getToken();
            await PromptService.save(token, this.state.model);

            await this.events.setLoading(false);
            await Dialogue(this, "Saved", "Your changes have been saved.");
            window.location.replace("prompt.html?guid=" + this.state.model.guid);
        }
        catch (err) {
            await ErrorMessage(this, err);
            await this.events.setLoading(false);
        }
    }

    private async deleteClicked(): Promise<void> {
        try {
            await this.events.setLoading(true);

            const token = await AuthService.getToken();
            await PromptService.delete(token, this.state.model.guid);

            await this.events.setLoading(false);
            window.history.back();
        }
        catch (err) {
            await ErrorMessage(this, err);
            await this.events.setLoading(false);
        }
    }

    private async suggestClicked(): Promise<void> {
        try {
            await this.events.setLoading(true);

            const token = await AuthService.getToken();
            const chatResponse = await AiciService.chat(token, [{
                role: "user",
                content: `Please provide a simple string title for the following JSON OpenAI message history.  Do not use markdown nor emojis.\n\n${JSON.stringify(this.state.messages)}`
            }]);

            const newPrompt = this.jsonCopy(this.state.model);
            newPrompt.title = chatResponse.choices[0].message.content;

            await this.updateState({ model: newPrompt });
            await this.events.setLoading(false);
        }
        catch (err) {
            await ErrorMessage(this, err);
            await this.events.setLoading(false);
        }
    }

    private async appendClicked(role: string, index: number): Promise<void> {
        try {
            await this.events.setLoading(true);

            const newMessages: AiciMessage[] = [];
            for (let cnt = 0; cnt < this.state.messages.length; cnt++) {
                newMessages.push(this.state.messages[cnt]);
                if (cnt == index) {
                    newMessages.push({
                        role: role == "user"
                            ? "user"
                            : "assistant",
                        content: ""
                    });
                    newMessages.push({
                        role: role == "user"
                            ? "assistant"
                            : "user",
                        content: ""
                    });
                }
            }

            const newPrompt = this.jsonCopy(this.state.model);
            newPrompt.json = JSON.stringify(newMessages);

            await this.updateState({
                messages: newMessages,
                model: newPrompt
            });

            await this.events.setLoading(false);
        }
        catch (err) {
            await ErrorMessage(this, err);
            await this.events.setLoading(false);
        }
    }

    public async runClicked(): Promise<void> {
        const embeddingLogic = new EmbeddingLogic(this.state.messages, this.state.model.input);
        try {
            await this.events.setLoading(true);

            this.updateState({
                status: `${embeddingLogic.completed.length} of ${embeddingLogic.originals.length} prompts done; ${embeddingLogic.tokens} tokens; ${embeddingLogic.milliseconds / 1000} seconds`,
                embeddingLogic: embeddingLogic
            });

            while (embeddingLogic.completed.length < embeddingLogic.originals.length) {
                await embeddingLogic.process();
                await this.updateState({
                    output: embeddingLogic.markdownCompletions(),
                    values: embeddingLogic.markdownValues(),
                    status: embeddingLogic.status,
                    embeddingLogic: embeddingLogic
                });
                await this.events.setLoading(false);
            }

            await this.updateState({
                status: `Done - ${embeddingLogic.status}`,
                embeddingLogic: embeddingLogic
            });
            await Dialogue(this, "Done", "We have completed processing the messages!");
        }
        catch (err) {
            await this.events.setLoading(false);
            await this.updateState({
                output: embeddingLogic.markdownCompletions(),
                values: embeddingLogic.markdownValues(),
                embeddingLogic: embeddingLogic
            });
            await ErrorMessage(this, err);
        }
        finally {
            await this.events.setLoading(false);
        }
    }

    public async saveDatasetClicked(): Promise<void> {
        try {
            await this.events.setLoading(true);

            const dto: DatasetDto = {
                guid: UUIDv4.generate(),
                includeInTraining: false,
                isUploaded: false,
                json: JSON.stringify(this.state.embeddingLogic.completed),
                title: this.state.model.title + " " + Date.now().toString()
            };

            const token = await AuthService.getToken();
            await DatasetService.save(token, dto);

            await Dialogue(this, "Saved", "You dataset has been saved!");

            await this.events.setLoading(false);
        }
        catch (err) {
            await this.events.setLoading(false);
            await ErrorMessage(this, err);
        }
    }

    private countLines(text: string): number {
        return text.split("\n").length;
    }

    private async saveFileClicked(name: string, contents: string) {
        await this.events.setLoading(true);

        try {
            const token = await AuthService.getToken();
            await AiciService.save(token, name, contents);
            await this.events.setLoading(false);
        }
        catch (err) {
            await ErrorMessage(this, err);
            await this.events.setLoading(false);
        }
    }

    private renderMessages(): React.ReactNode[] {
        const messages: React.ReactElement[] = [];

        this.state.messages.forEach((msg, index) => {
            messages.push(
                <>
                    <Field label={
                        msg.role == "user"
                            ? "User"
                            : "Assistant"
                    } key={index}>
                        <TextArea
                            style={{
                                height: this.countLines(msg.content) * 1.4 + 2 + "em"
                            }}
                            monospace={true}
                            showAll={true}
                            value={msg.content}
                            onChange={async (value) => {
                                const newMessages = this.jsonCopy(this.state.messages);
                                newMessages[index].content = value;

                                const newPrompt = this.jsonCopy(this.state.model);
                                newPrompt.json = JSON.stringify(newMessages);

                                await this.updateState({
                                    model: newPrompt,
                                    messages: newMessages
                                });
                            }}
                        />
                    </Field>
                    <Field>
                        {
                            msg.role == "user"
                                ? <Button label="Add A+U" onClick={() => { this.appendClicked("assistant", index); }} />
                                : <Button label="Add U+A" onClick={() => { this.appendClicked("user", index); }} />
                        }
                        <Button label="Remove" onClick={this.removeClicked.bind(this, index)} />
                    </Field>
                </>
            );
        });
        return messages;
    }

    public renderFiles(): React.ReactElement {
        let nodes: React.ReactNode[] = [];

        let md = "## Files\n";
        nodes.push(<Markdown page={this}>{md}</Markdown>);

        if (this.state.embeddingLogic) {
            const fileNames = Object.keys(this.state.embeddingLogic.fileNameToContents);
            for (let fileName of fileNames) {
                const contents = this.state.embeddingLogic.fileNameToContents[fileName];

                md = "**File name `" + fileName + "`**:\n";
                nodes.push(<Markdown page={this}>{md}</Markdown>);

                md = "```\n";
                md += contents;
                md += "\n```\n";
                nodes.push(<Markdown page={this}>{md}</Markdown>);

                nodes.push(<FlexRow><Button
                    label="Save File"
                    onClick={() => {
                        this.saveFileClicked(fileName, contents);
                    }}
                /></FlexRow>)
            }
        }

        return <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "1em"
        }}>{nodes}</div>;
    }
    public render(): React.ReactNode {
        const messages = this.renderMessages();

        return (
            <Navigation
                state={this.state} events={this.events}
                topMenuGuid="a4b3b92f-3037-4780-a5c2-3d9d85d6b5a4"
                leftMenuGuid="2d926f48-3007-4912-b6e7-a55a2af65d62"
            >
                <Heading level={1}>Prompt Edit</Heading>
                <Form>
                    <Field label="GUID" size={3}>
                        <Input
                            value={this.state.model.guid}
                        />
                    </Field>
                    <Field label="Title">
                        <Input
                            value={this.state.model.title}
                            onChange={async (value) => {
                                const newModel = this.jsonCopy(this.state.model);
                                newModel.title = value;

                                await this.updateState({
                                    model: newModel
                                });
                            }}
                        />
                    </Field>
                    <Field>
                        <Button label="Suggest Name" onClick={this.suggestClicked.bind(this)} />
                        <Button label="Run" onClick={this.runClicked.bind(this)} />
                        <Button label="Save" onClick={this.saveClicked.bind(this)} />
                        <Button label="Delete" onClick={this.deleteClicked.bind(this)} />
                    </Field>

                    <Heading level={2}>Input</Heading>
                    <Field label="Input">
                        <TextArea
                            rows={10}
                            value={this.state.model.input}
                            onChange={async (value) => {
                                const newModel = this.jsonCopy(this.state.model);
                                newModel.input = value;

                                await this.updateState({
                                    model: newModel
                                });
                            }}
                        />
                    </Field>
                </Form>
                <div>
                    {this.state.status}
                </div>
                <Tabs
                    components={{
                        "Messages": <>
                            <Heading level={2}>Messages</Heading>
                            {messages}
                        </>,
                        "Files": this.renderFiles(),
                        "Values": <Markdown page={this}>{this.state.values}</Markdown>,
                        "Output": this.state.output
                            ? <>
                                <Markdown page={this}>{this.state.output}</Markdown>
                                <br />
                                <FlexRow>
                                    <Button label="Save Dataset" onClick={this.saveDatasetClicked.bind(this)} />
                                </FlexRow>
                            </>
                            : null
                    }}
                />

            </Navigation>
        );
    }
}

window.onload = () => {
    const element = document.getElementById('root');
    const root = createRoot(element);
    root.render(<Page />);
};

window.onpageshow = (event) => {
    if (event.persisted) {
        window.location.reload();
    }
};