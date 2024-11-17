import * as React from "react";
import { createRoot } from "react-dom/client";
import { BasePage, BasePageState } from "../../tre/components/BasePage";
import { Heading } from "../../tre/components/Heading";
import { Form } from "../../tre/components/Form";
import { Field } from "../../tre/components/Field";
import { FlexRow } from "../../tre/components/FlexRow";
import { Button } from "../../tre/components/Button";
import { TextArea } from "../../tre/components/TextArea";
import { ErrorMessage, Navigation } from "../../tre/components/Navigation";
import { AiciService } from "../services/AiciService";
import { Markdown } from "../../tre/components/Markdown";
import { Input } from "../../tre/components/Input";
import { Select } from "../../tre/components/Select";
import { Checkbox } from "../../tre/components/Checkbox";
import { AuthService } from "../../tre/services/AuthService";

interface Props { }

interface State extends BasePageState {
    similarTo: string;         
    collection: string;       
    limit: string;            
    results: any;             
    showContent: boolean;     
}

class Page extends BasePage<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            ...BasePage.defaultState,
            similarTo: "",
            collection: "name",
            limit: "10",
            results: null,
            showContent: false
        };
    }

    private async searchClicked() {
        try {
            await this.events.setLoading(true);

            const token = await AuthService.getToken();
            const ret = await AiciService.search(
                token,
                this.state.collection,
                this.state.similarTo,
                Number.parseInt(this.state.limit)
            );
            await this.updateState({ results: ret });

            await this.events.setLoading(false);
        } catch (err) {
            await this.events.setLoading(false);
            await ErrorMessage(this, err);
        }
    }

    public render(): React.ReactNode {
        let md = "";
        if (this.state.results) {
            md += "## Results\n\n";
            this.state.results.forEach((result: any) => {
                md += `- ${result.payload.title}\n\n`;
                md += `   - **Score:** ${result.score}\n`;
                md += `   - **Tokens:** ${result.payload.totalTokens}\n`;
                if (this.state.showContent)
                    md += `\`\`\`\n${result.payload.content}\n\`\`\`\n\n`;
            });
        }

        return (
            <Navigation
                state={this.state}
                events={this.events}
                topMenuGuid="a4b3b92f-3037-4780-a5c2-3d9d85d6b5a4"
                leftMenuGuid="f8d6fabe-c73a-4dac-bb4b-c85c776c45c1"
            >
                <Heading level={1}>Search</Heading>
                <Form>
                    <Field label="Similar To">
                        <TextArea
                            value={this.state.similarTo}
                            onChange={(value) => {
                                this.setState({
                                    similarTo: value
                                });
                            }}
                        />
                    </Field>
                    <Field label="Content" size={2}>
                        <Select
                            value={this.state.collection}
                            onChange={async (value) => {
                                await this.updateState({ collection: value });
                            }}
                        >
                            <option value="name">Name</option>
                            <option value="content">Content</option>
                            <option value="explanation">Explanation</option>
                        </Select>
                    </Field>
                    <Field label="Limit" size={1}>
                        <Input
                            value={this.state.limit}
                            onChange={(value) => {
                                this.setState({
                                    limit: value
                                });
                            }}
                        />
                    </Field>
                    <Field label="Content" size={1}>
                        <Checkbox
                            checked={this.state.showContent}
                            onChange={(value) => {
                                this.setState({
                                    showContent: value
                                });
                            }}
                        />
                    </Field>
                    <FlexRow gap="1em">
                        <Button label="Search" onClick={this.searchClicked.bind(this)} />
                    </FlexRow>
                </Form>

                <Markdown page={this}>{md}</Markdown>
            </Navigation>
        );
    }
}

window.onload = () => {
    const element = document.getElementById("root");
    const root = createRoot(element);
    root.render(<Page />);
};

window.onpageshow = (event) => {
    if (event.persisted) {
        window.location.reload();
    }
};