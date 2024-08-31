import React, { Component, createRef } from "react";
import { TextArea } from "../components/TextArea";
import { Theme } from "../Theme";
import { marked } from "marked";
import { Message } from "../models/Message";
import { ChatService } from "../services/ChatService";
import { Response } from "../models/Response";
import { SuggestionsService } from "../services/SuggestionsService";
import { Dataset } from "../models/Dataset";
import { UUIDv4 } from "../logic/UUIDv4";
import { Alert } from "../models/Alert";
import { PageInterface } from "./PageInterface";
import { Dictionary } from "../models/Dictionary";
import { ConfigurationService } from "../services/ConfigurationService";

interface Props {
	alert: (alert: Alert) => void;
	loading: (show: boolean) => void;
	shared: Dictionary<string>;
	setShared: (dic: Dictionary<string>, callback: (() => void) | undefined) => void;

}

interface State {
	messages: Message[];
	showingStart: boolean;
	input: string;
	defaultMessages: Message[];
}

export class ChatPage extends Component<Props, State> implements PageInterface<Props, State> {
	private chatHistoryRef = createRef<HTMLDivElement>();

	public constructor(props: Props) {
		super(props);
		this.state = {
			input: "",
			messages: [
				{
					role: "user",
					content: "You are a programmer. You are professional and to the point."
				},
				{
					role: "assistant",
					content: "I am a programmer that directly answers questions professionally."
				}
			],
			showingStart: true,
			defaultMessages: [
				{
					role: "user",
					content: "You are a programmer. You are professional and to the point."
				},
				{
					role: "assistant",
					content: "I am a programmer that directly answers questions professionally."
				}
			]
		};
	}

	public async componentDidMount(): Promise<void> {
		try {
			this.props.loading(true);

			const config = await ConfigurationService.load();

			let messages = config.startingConversation;
			if (this.props.shared["messages"])
				messages = JSON.parse(this.props.shared["messages"]);

			this.setState({
				messages: messages,
				defaultMessages: config.startingConversation
			}, () => {
				this.props.setShared({}, async () => {
					if (this.state.messages[this.state.messages.length - 1].role != "assistant")
						await this.sendMessage(this.state.messages);

					this.props.loading(false);
				});
			});
		}
		catch (err) {
			this.props.alert({ title: "Error", message: (err as Error).message });
		}
	}

	private inputChanged(event: React.ChangeEvent<HTMLTextAreaElement>) {
		this.setState({ input: event.target.value });
	}

	private sendClicked() {
		if (!this.state.input) {
			this.props.alert({ title: "Error", message: "Cannot send an empty message." });
			return;
		}

		const userMessage: Message = {
			role: "user",
			content: this.state.input
		};

		let userMessages = JSON.parse(JSON.stringify(this.state.messages));
		userMessages.push(userMessage);

		this.props.loading(true);

		this.setState({
			messages: userMessages,
			showingStart: false,
			input: ""
		}, () => {
			this.scrollToBottom();
			this.sendMessage(userMessages)
				.catch((err: Error) => {
					this.props.alert({ title: "Error", message: err.message });
					this.scrollToBottom();
				});
		});
	}

	private async sendMessage(msgs: Message[]): Promise<Response> {
		const response = await ChatService.send(msgs);
		let assistantMessages = JSON.parse(JSON.stringify(this.state.messages));
		assistantMessages.push(response.message);

		this.setState({
			messages: assistantMessages,
		}, () => {
			this.scrollToBottom();
			this.props.loading(false);
		});

		return response;
	}

	private resetClicked() {
		this.setState({
			input: "",
			showingStart: true,
			messages: JSON.parse(JSON.stringify(this.state.defaultMessages))
		});
	}

	private async suggestionClicked() {
		try {
			let tempMessages: Message[] = JSON.parse(JSON.stringify(this.state.messages))
			const ds: Dataset = {
				guid: UUIDv4.generate(),
				title: Date.now().toString(),
				lessons: [{
					guid: UUIDv4.generate(),
					title: Date.now().toString(),
					messages: this.state.messages
				}]
			}

			await SuggestionsService.save(Date.now().toString(), ds);
			this.props.alert({ title: "Saved", message: "You data has been saved." });
			this.props.loading(false);
		}
		catch (err) {
			this.props.alert({ title: "Error", message: (err as Error).message });
		}
	}

	private scrollToBottom() {
		if (this.chatHistoryRef.current) {
			this.chatHistoryRef.current.scrollTop = this.chatHistoryRef.current.scrollHeight;
		}
	}

	public render() {
		let historyMd = "# Conversation\n";
		this.state.messages.forEach((msg) => {
			historyMd += "\n";
			historyMd += "## " + msg.role + "\n";
			historyMd += "\n";
			historyMd += msg.content + "\n";
			historyMd += "\n";
		});

		return (
			<div style={Theme.Chat}>
				<div
					ref={this.chatHistoryRef}
					className="marked"
					style={{
						...Theme.ChatHistory,
						height: "calc(75vh - " + Theme.FontSizePx * 16 + "px)",
						overflow: "auto"
					}}
					dangerouslySetInnerHTML={{ __html: marked.parse(historyMd) }}
				></div>

				<TextArea
					style={{
						...Theme.ChatTextArea,
						...Theme.Code,
						height: "calc(25vh)",
						marginBottom: Theme.FontSizePx + "px",
						marginTop: Theme.FontSizePx + "px"
					}}
					onChange={this.inputChanged.bind(this)}
					value={this.state.input}
				/>

				<div style={Theme.ChatButtons}>
					<button style={Theme.Button} onClick={this.sendClicked.bind(this)}>Send Message</button>
					<button style={Theme.Button} onClick={this.suggestionClicked.bind(this)}>Make Suggestion</button>
					<button style={Theme.Button} onClick={this.resetClicked.bind(this)}>Reset History</button>
				</div>
			</div>
		);
	}
}