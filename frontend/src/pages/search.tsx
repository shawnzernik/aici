import * as React from "react";
import { createRoot } from "react-dom/client";
import { BasePage, BasePageState } from "../components/BasePage";
import { Heading } from "../components/Heading";
import { Form } from "../components/Form";
import { Field } from "../components/Field";
import { FlexRow } from "../components/FlexRow";
import { Button } from "../components/Button";
import { TextArea } from "../components/TextArea";
import { ErrorMessage, Navigation } from "../components/Navigation";
import { AiciService } from "../services/AiciService";
import { AuthService } from "../services/AuthService";
import { Markdown } from "../components/Markdown";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { Checkbox } from "../components/Checkbox";

/**
 * Props for the Page component.
 */
interface Props { }

/**
 * State interface for the Page component, extending base page state.
 */
interface State extends BasePageState {
    similarTo: string;         // The text to search for similar items.
    collection: string;       // The type of content to search (e.g., name, content).
    limit: string;            // The maximum number of results to return.
    results: any;             // The search results returned from the AiciService.
    showContent: boolean;     // Flag to determine whether to show content in results.
}

/**
 * Page component that allows users to perform search queries.
 * Inherits base functionalities from BasePage.
 */
class Page extends BasePage<Props, State> {
    /**
     * Creates an instance of the Page component.
     * @param props - The props for the component.
     */
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

    /**
     * Handler for when the search button is clicked.
     * It fetches the search results from the AiciService using the current state values.
     */
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

    /**
     * Renders the component's UI.
     * @returns The rendered JSX of the component.
     */
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

// Initializes the root of the React application.
window.onload = () => {
    const element = document.getElementById('root');
    const root = createRoot(element);
    root.render(<Page />);
};

// Reloads the page when navigating back to a previously cached page.
window.onpageshow = (event) => {
    if (event.persisted) {
        window.location.reload();
    }
};
