import * as React from "react";
import { createRoot } from "react-dom/client";
import { ErrorMessage, Navigation } from "../../tre/components/Navigation";
import { BasePage, BasePageState } from "../../tre/components/BasePage";
import { Heading } from "../../tre/components/Heading";
import { Form } from "../../tre/components/Form";
import { Field } from "../../tre/components/Field";
import { Input } from "../../tre/components/Input";
import { FlexRow } from "../../tre/components/FlexRow";
import { Button } from "../../tre/components/Button";
import { AuthService } from "../services/AuthService";
import { SettingDto } from "common/src/tre/models/SettingDto";
import { SettingService } from "../services/SettingService";
import { TextArea } from "../../tre/components/TextArea";

interface Props { }
interface State extends BasePageState {
    model: SettingDto;
}

/**
 * Defines the Page component for editing settings.
 */
class Page extends BasePage<Props, State> {
    /**
     * Constructs the Page component.
     * @param props - The component props.
     */
    public constructor(props: Props) {
        super(props);

        this.state = {
            ...BasePage.defaultState,
            model: {
                guid: "",
                key: "",
                value: ""
            },
        }
    }

    /**
     * Lifecycle method that is called after the component is mounted.
     * Fetches the setting data based on the guid in the query string.
     */
    public async componentDidMount(): Promise<void> {
        await this.events.setLoading(true);

        const token = await AuthService.getToken();
        const guid = this.queryString("guid");

        try {
            const setting = await SettingService.get(token, guid);
            await this.updateState({ model: setting });
            await this.events.setLoading(false);
        }
        catch (err) {
            await ErrorMessage(this, err);
        }
    }

    /**
     * Handles the save button click event.
     * Saves the current setting model to the server.
     */
    public async saveClicked() {
        this.events.setLoading(true);
        try {
            const token = await AuthService.getToken();
            await SettingService.save(token, this.state.model);
            window.location.replace("setting.html?guid=" + this.state.model.guid);
            return;
        }
        catch (err) {
            await ErrorMessage(this, err);
            await this.events.setLoading(false);
        }
    }

    /**
     * Renders the component.
     * @returns The rendered component.
     */
    public render(): React.ReactNode {
        return (
            <Navigation
                state={this.state} events={this.events}
                topMenuGuid="b1e3c680-0f62-4931-8a68-4be9b4b070f7"
                leftMenuGuid="ac781ba3-dd39-4c4f-a68b-4894d733cccb"
            >
                <Heading level={1}>Setting Edit</Heading>
                <Form>
                    <Field label="GUID" size={3}><Input
                        readonly={true}
                        value={this.state.model.guid}
                    /></Field>
                    <Field label="Key" size={3}><Input
                        readonly={true}
                        value={this.state.model.key}
                    /></Field>
                    <Field label="Value"><TextArea
                        showAll={true}
                        value={this.state.model.value}
                        onChange={async (value) => {
                            const newModel = this.jsonCopy(this.state.model);;
                            newModel.value = value;
                            await this.updateState({ model: newModel });
                        }}
                    /></Field>
                </Form>
                <FlexRow gap="1em">
                    <Button label="Save" onClick={this.saveClicked.bind(this)} />
                </FlexRow>
            </Navigation>
        );
    }
}

window.onload = () => {
    const element = document.getElementById('root');
    const root = createRoot(element);
    root.render(<Page />)
};
window.onpageshow = (event) => {
    if (event.persisted) {
        window.location.reload();
    }
};
