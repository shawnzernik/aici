import * as React from "react";
import { createRoot } from "react-dom/client";
import { ErrorMessage, Navigation } from "../components/Navigation";
import { BasePage, BasePageState } from "../components/BasePage";
import { Heading } from "../components/Heading";
import { Field } from "../components/Field";
import { UUIDv4 } from "common/src/logic/UUIDv4";
import { AuthService } from "../services/AuthService";
import { Form } from "../components/Form";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { FlexRow } from "../components/FlexRow";
import { GroupDto } from "common/src/models/GroupDto";
import { GroupService } from "../services/GroupService";
import { Checkbox } from "../components/Checkbox";

interface Props { }

/**
 * State interface extending BasePageState to include model
 */
interface State extends BasePageState {
    model: GroupDto; // Model representing the group data
}

/**
 * Page class responsible for the Group Edit functionality
 */
class Page extends BasePage<Props, State> {
    /**
     * Constructor initializing the state
     * @param props - Component props
     */
    public constructor(props: Props) {
        super(props);

        this.state = {
            ...BasePage.defaultState,
            model: {
                displayName: "",
                guid: UUIDv4.generate(),
                isAdministrator: false
            }
        };
    }

    /**
     * Lifecycle method called after component mounted
     * Fetches the group data if a guid is provided in the query string
     */
    public async componentDidMount(): Promise<void> {
        await this.events.setLoading(true);

        const guid = this.queryString("guid");
        if (!guid) {
            await this.events.setLoading(false);
            return;
        }

        const token = await AuthService.getToken();

        const model = await GroupService.get(token, guid);
        await this.updateState({ model: model });
        await this.events.setLoading(false);
    }

    /**
     * Handler for save button click
     * Saves the current group data
     */
    public async saveClicked() {
        this.events.setLoading(true);
        try {
            const token = await AuthService.getToken();
            await GroupService.save(token, this.state.model);
            window.location.replace("group.html?guid=" + this.state.model.guid);
            return;
        }
        catch (err) {
            await ErrorMessage(this, err);
            await this.events.setLoading(false);
        }
    }

    /**
     * Handler for delete button click
     * Deletes the current group
     */
    public async deleteClicked() {
        this.events.setLoading(true);
        try {
            const token = await AuthService.getToken();
            await GroupService.delete(token, this.state.model.guid);
            window.history.back();
            return;
        }
        catch (err) {
            await ErrorMessage(this, err);
            await this.events.setLoading(false);
        }
    }

    /**
     * Renders the component
     * @returns React.ReactNode
     */
    public render(): React.ReactNode {
        return (
            <Navigation
                state={this.state} events={this.events}
                topMenuGuid="b1e3c680-0f62-4931-8a68-4be9b4b070f7"
                leftMenuGuid="d7db605a-ec82-4da6-8fae-df4d5bfb173d"
            >
                <Heading level={1}>Group Edit</Heading>
                <Form>
                    <Field label="GUID" size={3}><Input
                        readonly={true}
                        value={this.state.model.guid}
                    /></Field>
                    <Field label="Display" size={2}><Input
                        value={this.state.model.displayName}
                        onChange={async (value) => {
                            const newModel = this.jsonCopy(this.state.model);;
                            newModel.displayName = value;
                            await this.updateState({ model: newModel });
                        }}
                    /></Field>
                    <Field label="Display" size={1}><Checkbox
                        checked={this.state.model.isAdministrator}
                        onChange={async (value) => {
                            const newModel = this.jsonCopy(this.state.model);;
                            newModel.isAdministrator = value;
                            await this.updateState({ model: newModel });
                        }}
                    /></Field>
                </Form>
                <FlexRow gap="1em">
                    <Button label="Save" onClick={this.saveClicked.bind(this)} />
                    <Button label="Delete" onClick={this.deleteClicked.bind(this)} />
                </FlexRow>
            </Navigation>
        );
    }
}

/**
 * Window onload event to render the Page component
 */
window.onload = () => {
    const element = document.getElementById('root');
    const root = createRoot(element);
    root.render(<Page />)
};

/**
 * Window onpageshow event to handle page navigation
 * @param event - The event object
 */
window.onpageshow = (event) => {
    if (event.persisted) {
        window.location.reload();
    }
};
