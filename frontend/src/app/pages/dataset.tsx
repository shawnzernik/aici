import * as React from "react";
import { createRoot } from "react-dom/client";
import { Dialogue, ErrorMessage, Navigation } from "../../tre/components/Navigation";
import { BasePage, BasePageState } from "../../tre/components/BasePage";
import { Heading } from "../../tre/components/Heading";
import { Form } from "../../tre/components/Form";
import { Field } from "../../tre/components/Field";
import { Message as AiciMessage, MessageRole } from "common/src/app/models/Message";
import { DatasetDto } from "common/src/app/models/DatasetDto";
import { UUIDv4 } from "common/src/tre/logic/UUIDv4";
import { Input } from "../../tre/components/Input";
import { Checkbox } from "../../tre/components/Checkbox";
import { TextArea } from "../../tre/components/TextArea";
import { DatasetService } from "../services/DatasetService";
import { Button } from "../../tre/components/Button";
import { AiciService } from "../services/AiciService";
import { AuthService } from "../../tre/services/AuthService";

interface Props { }
interface State extends BasePageState {
    model: DatasetDto;
    messages: AiciMessage[];
}

class Page extends BasePage<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            ...BasePage.defaultState,
            model: {
                guid: UUIDv4.generate(),
                includeInTraining: false,
                isUploaded: false,
                title: "",
                json: ""
            },
            messages: []
        }
    }

    public async componentDidMount(): Promise<void> {
        try {
            await this.events.setLoading(true);

            const guid = this.queryString("guid");
            if (!guid)
                throw new Error("You must save a chat history to create a new dataset.");

            const token = await AuthService.getToken();
            const dataset = await DatasetService.get(token, guid);
            const messages = JSON.parse(dataset.json) as AiciMessage[];

            await this.updateState({
                messages: messages,
                model: dataset
            });

            await this.events.setLoading(false);
        }
        catch (err) {
            await ErrorMessage(this, err);
        }
    }

    private async resendClicked(index: number) {
        await this.events.setLoading(true);

        let newMessages: AiciMessage[] = [];

        for (let cnt = 0; cnt < index + 1; cnt++) {
            newMessages.push(this.state.messages[cnt]);
        }

        window.localStorage.setItem("Page.resendClicked", JSON.stringify(newMessages));
        window.location.assign("chat.html");
    }

    private async removeClicked(target: number) {
        await this.events.setLoading(true);

        let newMessages: AiciMessage[] = [];

        this.state.messages.forEach((msg, index) => {
            if (target !== index)
                newMessages.push(msg);
        });

        const newDataset = this.jsonCopy(this.state.model);
        newDataset.json = JSON.stringify(newMessages);

        await this.updateState({
            model: newDataset,
            messages: newMessages
        });

        await this.events.setLoading(false);
    }

    private async saveClicked() {
        try {
            await this.events.setLoading(true);

            const token = await AuthService.getToken();
            await DatasetService.save(token, this.state.model);

            await this.events.setLoading(false);
            await Dialogue(this, "Saved", "Your changes have been saved.");
            window.location.replace("dataset.html?guid=" + this.state.model.guid);
        }
        catch (err) {
            await ErrorMessage(this, err);
            await this.events.setLoading(false);
        }
    }

    private async deleteClicked() {
        try {
            await this.events.setLoading(true);

            const token = await AuthService.getToken();
            await DatasetService.delete(token, this.state.model.guid);

            await this.events.setLoading(false);
            window.history.back();
        }
        catch (err) {
            await ErrorMessage(this, err);
            await this.events.setLoading(false);
        }
    }

    private async suggestClicked() {
        try {
            await this.events.setLoading(true);

            const token = await AuthService.getToken();
            const chatResponse = await AiciService.chat(token, [{
                role: "user",
                content: `Please provide a simple string title for the following JSON OpenAI message history.  Do not use markdown nor emojis.\n\n${JSON.stringify(this.state.messages)}`
            }]);

            const newDataset = this.jsonCopy(this.state.model);
            newDataset.title = chatResponse.choices[0].message.content;

            await this.updateState({ model: newDataset });
            await this.events.setLoading(false);
        }
        catch (err) {
            await ErrorMessage(this, err);
            await this.events.setLoading(false);
        }
    }

    async appendClicked(role: string) {
        try {
            await this.events.setLoading(true);

            const newMessages = this.jsonCopy(this.state.messages);
            newMessages.push({
                role: role as MessageRole,
                content: ""
            });

            const newDataset = this.jsonCopy(this.state.model);
            newDataset.json = JSON.stringify(newMessages);

            await this.updateState({
                messages: newMessages,
                model: newDataset
            });

            await this.events.setLoading(false);
        }
        catch (err) {
            await ErrorMessage(this, err);
            await this.events.setLoading(false);
        }
    }

    private countLines(text: string) {
        return text.split("\n").length;
    }

    public render(): React.ReactNode {
        const messages: React.ReactElement[] = [];

        this.state.messages.forEach((msg, index) => {
            messages.push(
                <>
                    <Field label={msg.role} key={index}>
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

                                const newDataset = this.jsonCopy(this.state.model);
                                newDataset.json = JSON.stringify(newMessages);

                                await this.updateState({
                                    model: newDataset,
                                    messages: newMessages
                                });
                            }}
                        />
                    </Field>
                    <Field>
                        {
                            msg.role == "user"
                                ? <Button label="Resend" onClick={this.resendClicked.bind(this, index)} />
                                : null
                        }
                        {
                            msg.role == "user" && index + 1 == this.state.messages.length
                                ? <Button label="Append" onClick={() => { this.appendClicked("assistant"); }} />
                                : msg.role == "assistant" && index + 1 == this.state.messages.length
                                    ? <Button label="Append" onClick={() => { this.appendClicked("user"); }} />
                                    : null
                        }
                        <Button label="Remove" onClick={this.removeClicked.bind(this, index)} />
                    </Field>
                </>
            );
        });

        return (
            <Navigation
                state={this.state} events={this.events}
                topMenuGuid="a4b3b92f-3037-4780-a5c2-3d9d85d6b5a4"
                leftMenuGuid="6b8c801f-c6f9-42d6-8502-c2ea75287f26"
            >
                <Heading level={1}>Dataset Edit</Heading>
                <Form>
                    <Field label="GUID" size={3}>
                        <Input
                            value={this.state.model.guid}
                        />
                    </Field>
                    <Field label="Uploaded" size={1}>
                        <Checkbox
                            checked={this.state.model.isUploaded}
                            onChange={async (value) => {
                                const newDataset = this.jsonCopy(this.state.model);
                                newDataset.isUploaded = value;

                                await this.updateState({
                                    model: newDataset
                                });
                            }}
                        />
                    </Field>
                    <Field label="Train On" size={1}>
                        <Checkbox
                            checked={this.state.model.includeInTraining}
                            onChange={async (value) => {
                                const newDataset = this.jsonCopy(this.state.model);
                                newDataset.includeInTraining = value;

                                await this.updateState({
                                    model: newDataset
                                });
                            }}
                        />
                    </Field>
                    <Field label="Title">
                        <Input
                            value={this.state.model.title}
                            onChange={async (value) => {
                                const newDataset = this.jsonCopy(this.state.model);
                                newDataset.title = value;

                                await this.updateState({
                                    model: newDataset
                                });
                            }}
                        />
                    </Field>
                    <Field>
                        <Button label="Suggest Name" onClick={this.suggestClicked.bind(this)} />
                        <Button label="Save" onClick={this.saveClicked.bind(this)} />
                        <Button label="Delete" onClick={this.deleteClicked.bind(this)} />
                    </Field>

                    <Heading level={2}>Conversation</Heading>
                    {messages}
                </Form>
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