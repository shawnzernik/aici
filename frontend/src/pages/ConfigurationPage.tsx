import React, { Component } from "react";
import { Form } from "../components/Form";
import { Field } from "../components/Field";
import { Input } from "../components/Input";
import { Theme } from "../Theme";
import { Alert } from "../models/Alert";
import { Dictionary } from "../models/Dictionary";
import { ConfigurationService } from "../services/ConfigurationService";
import { Configuration } from "../models/Configuration";
import { TextArea } from "../components/TextArea";
import { Select } from "../components/Select";
import { ChatService } from "../services/ChatService";

interface Props {
    alert: (alert: Alert) => void;
    loading: (show: boolean) => void;
    shared: Dictionary<string>;
    setShared: (dic: Dictionary<string>, callback: (() => void) | undefined) => void;

}

interface State {
    config: Configuration;
}

export class ConfigurationPage extends Component<Props, State> {
    public constructor(props: Props) {
        super(props);
        this.state = {
            config: {
                startingConversation: [
                    { role: "user", content: "" },
                    { role: "user", content: "" }
                ],
                model: "",
                hfToken: "",
                maxNewTokens: 4000,
                messageRegex: "",
                sourceModel: "",
                targetModel: "",
                taskType: "",
                epochs: 0,
                trainMaxLength: 1000,
                trainOutputDir: "",
                targetLoss: 0.5,
                pushToModel: ""
            }
        };
    }

    public componentDidMount(): void {
        this.reloadClicked();
    }


    private async reloadClicked() {
        this.props.loading(true);

        try {
            const config = await ConfigurationService.load();
            this.setState({ config: config }, () => {
                this.setState({ config }, () => {
                    this.props.loading(false);
                });
            });
        }
        catch(err) {
            this.props.alert({ title: "Error", message: (err as Error).message });
        }
    };

    private async restartClicked() {
        try {
            this.props.loading(true);

            await ChatService.reload();
            const config = await ConfigurationService.load();

            const newShared = JSON.parse(JSON.stringify(this.props.shared));
            newShared["model"] = config.model;
            this.props.setShared(newShared, () => {
                this.props.loading(false);
            });
        }
        catch (err) {
            this.props.alert({ title: "Error", message: (err as Error).message });
        }
    }
    private async train() {
        try {
            this.props.loading(true);
            await ChatService.train();
            await ChatService.reload();
            this.props.loading(false);
        }
        catch(err) {
            this.props.alert({ title: "Error", message: (err as Error).message });
        }
    }

    private async saveClicked() {
        try {
            this.props.loading(true);
            await ConfigurationService.save(this.state.config);
            await this.reloadClicked();
        }
        catch(err) {
            this.props.alert({ title: "Error", message: (err as Error).message });
        }
    };

    private async pushHub() {
        try {
            this.props.loading(true);
            await ChatService.pushToHub();
            this.props.loading(false);
        }
        catch(err) {
            this.props.alert({ title: "Error", message: (err as Error).message });
        }

    }

    public render() {
        const config: Configuration = JSON.parse(JSON.stringify(this.state.config));
        console.log(config)


        const startingConversation: React.ReactElement[] = [];
        this.state.config.startingConversation.forEach((msg, index) => {
            startingConversation.push(
                <Field label="Role" size={1} style={{ width: "100%" }}>
                    <Select
                        onChange={(e) => {
                            config.startingConversation[index].role = e.target.value;
                            this.setState({ config });
                        }}
                        value={config.startingConversation[index].role}
                        options={{
                            "system": "system",
                            "user": "user",
                            "assistant": "assistant"
                        }}
                    />
                </Field>
            );
            startingConversation.push(
                <Field label="Assistant" size={1} style={{ width: "100%" }}>
                    <TextArea
                        style={Theme.Code}
                        onChange={(e) => {
                            config.startingConversation[index].content = e.target.value;
                            this.setState({ config });
                        }}
                        value={config.startingConversation[index].content}
                    />
                </Field>
            );
        });

        return (
            <>
                <div style={Theme.Config}>
                    <h1>Configuration</h1>
                    <Form>
                        <Field label="Model" size={2}>
                            <Input
                                onChange={(e) => {
                                    config.model = e.target.value;
                                    this.setState({ config });
                                }}
                                value={config.model}
                            />
                        </Field>
                        <Field label="HF Token" size={2}>
                            <Input
                                onChange={(e) => {
                                    config.hfToken = e.target.value;
                                    this.setState({ config });
                                }}
                                value={config.hfToken}
                            />
                        </Field>
                        <Field label="Max New Tokens" size={1}>
                            <Input
                                onChange={(e) => {
                                    config.maxNewTokens = Number.parseInt(e.target.value);
                                    this.setState({ config });
                                }}
                                value={config.maxNewTokens.toString()}
                            />
                        </Field>
                        <Field label="Message Regex" size={3}>
                            <Input
                                onChange={(e) => {
                                    const config: Configuration = JSON.parse(JSON.stringify(this.state.config));
                                    config.messageRegex = e.target.value;
                                    this.setState({ config });
                                }}
                                value={config.messageRegex}
                            />
                        </Field>
                    </Form>

                    <h2>Training</h2>
                    <Form>
                        <Field label="Source Model" size={2}>
                            <Input
                                onChange={(e) => {
                                    config.sourceModel = e.target.value;
                                    this.setState({ config });
                                }}
                                value={config.sourceModel}
                            />
                        </Field>
                        <Field label="Target Model" size={2}>
                            <Input
                                onChange={(e) => {
                                    config.targetModel = e.target.value;
                                    this.setState({ config });
                                }}
                                value={config.targetModel}
                            />
                        </Field>
                        <Field label="Task Type" size={2}>
                            <Input
                                onChange={(e) => {
                                    config.taskType = e.target.value;
                                    this.setState({ config });
                                }}
                                value={config.taskType}
                            />
                        </Field>
                        <Field label="Epochs" size={1}>
                            <Input
                                onChange={(e) => {
                                    config.epochs = Number.parseInt(e.target.value);
                                    this.setState({ config });
                                }}
                                value={config.epochs.toString()}
                            />
                        </Field>
                        <Field label="Max Length" size={1}>
                            <Input
                                onChange={(e) => {
                                    config.trainMaxLength = Number.parseInt(e.target.value);
                                    this.setState({ config });
                                }}
                                value={config.trainMaxLength.toString()}
                            />
                        </Field>
                        <Field label="Output Dir" size={2}>
                            <Input
                                onChange={(e) => {
                                    config.trainOutputDir = e.target.value;
                                    this.setState({ config });
                                }}
                                value={config.trainOutputDir}
                            />
                        </Field>
                        <Field label="Loss" size={1}>
                            <Input
                                onChange={(e) => {
                                    config.targetLoss = Number.parseFloat(e.target.value);
                                    this.setState({ config });
                                }}
                                value={config.targetLoss.toFixed(2)}
                            />
                        </Field>
                        <Field label="Push to Model" size={2}>
                            <Input
                                onChange={(e) => {
                                    config.pushToModel = e.target.value;
                                    this.setState({ config });
                                }}
                                value={config.pushToModel}
                            />
                        </Field>
                    </Form>
                    <div style={Theme.TrainingButtons}>
                    <button style={Theme.Button} onClick={this.train.bind(this)}>Train</button>
                    <button style={Theme.Button} onClick={this.pushHub.bind(this)}>Push to Hub</button>
                    </div>

                    <h2>Starting Conversation</h2>
                    <Form>{startingConversation}</Form>

                    <div style={Theme.TrainingButtons}>
                        <button style={Theme.Button} onClick={this.reloadClicked.bind(this)}>Reload Config</button>
                        <button style={Theme.Button} onClick={this.saveClicked.bind(this)}>Save Config</button>
                        <button style={Theme.Button} onClick={this.restartClicked.bind(this)}>Restart AI</button>
                    </div>
                </div>
            </>
        );
    }
}