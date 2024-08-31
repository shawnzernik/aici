import React, { Component } from "react";
import { Alert } from "../models/Alert";
import { Dictionary } from "../models/Dictionary";
import { Theme } from "../Theme";
import { Dataset } from "../models/Dataset";
import { SuggestionsService } from "../services/SuggestionsService";
import { DatasetsService } from "../services/DatasetsService";
import { Lesson } from "../models/Lesson";
import { Form } from "../components/Form";
import { Field } from "../components/Field";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { TextArea } from "../components/TextArea";
import { ChatService } from "../services/ChatService";
import { Message } from "../models/Message";
import { UUIDv4 } from "../logic/UUIDv4";

interface Props {
    alert: (alert: Alert) => void;
    loading: (show: boolean) => void;
    shared: Dictionary<string>;
    setShared: (dic: Dictionary<string>, callback: (()=> void) | undefined) => void;
    setActive: (name: string) => void;
}

interface State {
    dataset: Dataset,
    lesson: Lesson
}

export class DatasetPage extends Component<Props, State> {
    public constructor(props: Props) {
        super(props);
        this.state = {
            dataset: {
                guid: "",
                title: "",
                lessons: []
            },
            lesson: {
                guid: "",
                title: "",
                messages: []
            }
        };
    }

    public componentDidMount(): void {
        this.reload();
    }

    private updateLesson(lesson: Lesson, callback: (() => void) | undefined = undefined) {
        const ds: Dataset = JSON.parse(JSON.stringify(this.state.dataset));

        let target = -1;
        ds.lessons.forEach((current, index) => {
            if (lesson.guid == current.guid)
                target = index;
        });

        if (target < 0) {
            this.props.alert({ title: "Error", message: "Could not locate target lesson by GUID!" });
            return;
        }

        ds.lessons[target] = lesson;

        this.setState({
            dataset: ds,
            lesson: lesson
        }, callback);
    }
    private countNewLines(value: string): number {
        let ret = 0;
        for (let cnt = 0; cnt < value.length; cnt++)
            if (value.charAt(cnt) == "\n")
                ret++;

        return ret;
    }

    private save() {
        this.props.loading(true);

        let promise: Promise<void> = Promise.resolve();
        if (this.props.shared.type == "suggestion")
            promise = SuggestionsService.save(this.props.shared["file"], this.state.dataset);
        else if (this.props.shared.type == "dataset")
            promise = DatasetsService.save(this.props.shared["file"], this.state.dataset);
        else {
            this.props.alert({ title: "Error", message: "File type is invalid!" });
            return;
        }

        promise.then(() => {
            return this.reload();
        })
            .catch((err: Error) => {
                this.props.alert({ title: "Error", message: "File type is invalid!" });
            });

    }
    private reload() {
        this.props.loading(true);

        let promise: Promise<Dataset>;

        if (this.props.shared["type"] == "suggestion")
            promise = SuggestionsService.read(this.props.shared["file"]);
        else if (this.props.shared["type"] == "dataset")
            promise = DatasetsService.read(this.props.shared["file"]);
        else
            throw Error("Type is invalid!");

        promise.then((ds) => {
            this.setState({
                dataset: ds,
                lesson: {
                    guid: "",
                    title: "",
                    messages: []
                }
            }, () => {
                this.props.loading(false);
            });
        });
    }
    private recommendDsTitle() {
        let content = "";

        this.state.dataset.lessons.forEach((lesson) => {
            lesson.messages.forEach((msg) => {
                content += "\n\n" + msg.content + "\n\n";
            });
        });

        const request: Message = {
            role: "user",
            content: `The following is a conversation history.

======== BEGIN OF CONVERSATION ========

${content}

======== END OF CONVERSATION ========

Create a title for the conversation history.  Keep it to 10 words or less.`
        };

        this.props.loading(true);

        ChatService.send([request])
            .then((value) => {
                const newDs: Dataset = JSON.parse(JSON.stringify(this.state.dataset))
                newDs.title = value.message.content;
                this.setState({ dataset: newDs }, () => {
                    this.props.loading(false);
                });
            })
            .catch((err: Error) => {
                this.props.alert({ title: "Error", message: err.message });
            });
    }
    private appendMessage() {
        const newLesson: Lesson = JSON.parse(JSON.stringify(this.state.lesson));
        newLesson.messages.push({ role: "user", content: "" });
        this.updateLesson(newLesson);
    }
    private recommendLessonTitle() {
        let content = "";

        this.state.lesson.messages.forEach((msg) => {
            content += "\n\n" + msg.content + "\n\n";
        });

        const request: Message = {
            role: "user",
            content: `The following is a conversation history.

======== BEGIN OF CONVERSATION ========

${content}

======== END OF CONVERSATION ========

Create a title for the conversation history.  Keep it to 10 words or less.`
        };

        this.props.loading(true);

        ChatService.send([request])
            .then((value) => {
                const newLesson: Lesson = JSON.parse(JSON.stringify(this.state.lesson))
                newLesson.title = value.message.content;
                this.updateLesson(newLesson, () => {
                    this.props.loading(false);
                });
            })
            .catch((err: Error) => {
                this.props.alert({ title: "Error", message: err.message });
            });
    }
    private deleteMessage(index: number) {
        const newLesson: Lesson = JSON.parse(JSON.stringify(this.state.lesson));

        const newMessages: Message[] = [];
        newLesson.messages.forEach((msg, current) => {
            if (current != index)
                newMessages.push(msg);
        });
        newLesson.messages = newMessages;

        this.updateLesson(newLesson);
    }
    private deleteDs() {
        let promise: Promise<void> = Promise.resolve();
        if (this.props.shared.type == "suggestion")
            promise = SuggestionsService.delete(this.props.shared["file"]);
        else if (this.props.shared.type == "dataset")
            promise = DatasetsService.delete(this.props.shared["file"]);
        else {
            this.props.alert({ title: "Error", message: "File type is invalid!" });
            return;
        }

        promise
            .then(() => {
                this.props.setActive("DatasetsPage");
            })
            .catch((err: Error) => {
                this.props.alert({ title: "Error", message: "File type is invalid!" });
            });
    }
    private deleteLesson() {
        const newDs: Dataset = JSON.parse(JSON.stringify(this.state.dataset));

        const newLessons: Lesson[] = [];
        newDs.lessons.forEach((lesson) => {
            if (lesson.guid != this.state.lesson.guid)
                newLessons.push(lesson);
        });

        newDs.lessons = newLessons;

        this.setState({
            dataset: newDs,
            lesson: {
                guid: "",
                title: "",
                messages: []
            }
        });
    }
    private resendMessages(index: number) {
        const messages: Message[] = [];
        for(let cnt: number = 0; cnt < this.state.lesson.messages.length && cnt <= index; cnt++)
            messages.push(JSON.parse(JSON.stringify(this.state.lesson.messages[cnt])));

        const newShared: Dictionary<string> = JSON.parse(JSON.stringify(this.props.shared));
        newShared["messages"] = JSON.stringify(messages);
        this.props.setShared(newShared, () => {
            this.props.setActive("ChatPage");
        });
    }
    private duplicateLesson() {
        const newLesson: Lesson = JSON.parse(JSON.stringify(this.state.lesson));
        newLesson.title = "Duplicated-" + Date.now();
        newLesson.guid = UUIDv4.generate();

        const ds: Dataset = JSON.parse(JSON.stringify(this.state.dataset))
        ds.lessons.push(newLesson);
        this.setState({
            dataset: ds,
            lesson: newLesson
        });
    }

    public render() {
        const lessons: React.ReactElement[] = [];
        this.state.dataset.lessons.forEach((lesson) => {
            lessons.push(
                <p
                    style={{ color: Theme.LightText, cursor: "pointer" }}
                    onClick={() => { this.setState({ lesson: lesson }); }}
                > {lesson.title}</p >
            );
        });

        const conversation: React.ReactElement[] = [];
        if (this.state.lesson.guid) {
            conversation.push(<h2>Conversation</h2>);
            conversation.push(
                <Form>
                    <Field label="Title" size={20} style={{ width: "100%" }}>
                        <Input
                            onChange={(e) => {
                                const newLesson: Lesson = JSON.parse(JSON.stringify(this.state.lesson));
                                newLesson.title = e.target.value;
                                this.updateLesson(newLesson);
                            }}
                            value={this.state.lesson.title}
                        />
                    </Field>
                </Form>
            );
            conversation.push(<div style={Theme.Buttons}>
                <button style={Theme.Button} onClick={this.appendMessage.bind(this)}>Append Message</button>
                <button style={Theme.Button} onClick={this.duplicateLesson.bind(this)}>Duplicate Lesson</button>
                <button style={Theme.Button} onClick={this.recommendLessonTitle.bind(this)}>Recommend Title</button>
                <button style={Theme.Button} onClick={this.deleteLesson.bind(this)}>Delete Lesson</button>
            </div>);
            this.state.lesson.messages.forEach((msg, index) => {
                conversation.push(<Field label="Role" size={20} style={{ width: "100%", marginTop: Theme.FontSizePx + "px" }}><Select
                    onChange={(e) => {
                        const newLesson: Lesson = JSON.parse(JSON.stringify(this.state.lesson));
                        newLesson.messages[index].role = e.target.value;
                        this.updateLesson(newLesson);
                    }}
                    value={
                        this.state.lesson.messages[index].role
                    }
                    options={{
                        user: "user",
                        system: "system",
                        assistant: "assistant"
                    }}
                /></Field>);

                const newLines: number = this.countNewLines(this.state.lesson.messages[index].content);
                let height = (newLines + 4) * 1.4 * Theme.FontSizePx;
                // let maxHeight = window.innerHeight - (Theme.FontSizePx * 15);
                // if (height > maxHeight)
                //     height = maxHeight;

                conversation.push(<Field label="Content" size={20} style={{ width: "100%" }}><TextArea
                    style={{
                        height: height + "px",
                        ...Theme.Code
                    }}
                    onChange={(e) => {
                        const newLesson: Lesson = JSON.parse(JSON.stringify(this.state.lesson));
                        newLesson.messages[index].content = e.target.value;
                        this.updateLesson(newLesson);
                    }}
                    value={
                        this.state.lesson.messages[index].content
                    }
                /></Field>);
                conversation.push(<div style={Theme.Buttons}>
                    <button style={Theme.Button} onClick={this.resendMessages.bind(this, index)}>Resend</button>
                    <button style={Theme.Button} onClick={this.deleteMessage.bind(this, index)}>Delete Row</button>
                    </div>);
            });
        }

        return (
            <>
                <div style={Theme.Datasets}></div>
                <div style={Theme.DatasetNav}>
                    Datasets &gt; {this.props.shared["type"]} &gt; {this.props.shared["file"]}
                </div>
                <div style={Theme.DatasetBody}>
                    <div style={Theme.DatasetBodyLessons}>
                        <h1 style={{ color: Theme.LightText }}>Lessons</h1>
                        {lessons}
                    </div>
                    <div style={Theme.DatasetBodyConversation}>
                        <h1>Dataset</h1>
                        <Form>
                            <Field label="Title" size={20} style={{ width: "100%" }}>
                                <Input
                                    onChange={(e) => {
                                        const newDs: Dataset = JSON.parse(JSON.stringify(this.state.dataset));
                                        newDs.title = e.target.value;
                                        this.setState({ dataset: newDs });
                                    }}
                                    value={this.state.dataset.title}
                                />
                            </Field>
                        </Form>
                        <div style={Theme.Buttons}>
                            <button style={Theme.Button} onClick={this.save.bind(this)}>Save</button>
                            <button style={Theme.Button} onClick={this.reload.bind(this)}>Reload</button>
                            <button style={Theme.Button} onClick={this.recommendDsTitle.bind(this)}>Recommend Title</button>
                            <button style={Theme.Button} onClick={this.deleteDs.bind(this)}>Delete Dataset</button>
                        </div>
                        {conversation}
                    </div>
                </div>
            </>
        );
    }
}