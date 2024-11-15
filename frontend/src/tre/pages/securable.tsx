import * as React from "react";
import { createRoot } from "react-dom/client";
import { ErrorMessage, Navigation } from "../../tre/components/Navigation";
import { BasePage, BasePageState } from "../../tre/components/BasePage";
import { Heading } from "../../tre/components/Heading";
import { Field } from "../../tre/components/Field";
import { SecurableDto } from "common/src/tre/models/SecurableDto";
import { UUIDv4 } from "common/src/tre/logic/UUIDv4";
import { SecurableService } from "../services/SecurableService";
import { AuthService } from "../services/AuthService";
import { Form } from "../../tre/components/Form";
import { Input } from "../../tre/components/Input";
import { Button } from "../../tre/components/Button";
import { FlexRow } from "../../tre/components/FlexRow";

interface Props { }
interface State extends BasePageState {
    model: SecurableDto;
}

class Page extends BasePage<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            ...BasePage.defaultState,
            model: {
                displayName: "",
                guid: UUIDv4.generate()
            }
        };
    }

    public async componentDidMount(): Promise<void> {
        await this.events.setLoading(true);

        const guid = this.queryString("guid");
        if (!guid) {
            await this.events.setLoading(false);
            return;
        }

        const token = await AuthService.getToken();

        const model = await SecurableService.get(token, guid);
        await this.updateState({ model: model });
        await this.events.setLoading(false);
    }

    public async saveClicked() {
        this.events.setLoading(true);
        try {
            const token = await AuthService.getToken();
            await SecurableService.save(token, this.state.model);
            window.location.replace("securable.html?guid=" + this.state.model.guid);
            return;
        }
        catch (err) {
            await ErrorMessage(this, err);
            await this.events.setLoading(false);
        }
    }

    public async deleteClicked() {
        this.events.setLoading(true);
        try {
            const token = await AuthService.getToken();
            await SecurableService.delete(token, this.state.model.guid);
            window.history.back();
            return;
        }
        catch (err) {
            await ErrorMessage(this, err);
            await this.events.setLoading(false);
        }
    }

    public render(): React.ReactNode {
        return (
            <Navigation
                state={this.state} events={this.events}
                topMenuGuid="b1e3c680-0f62-4931-8a68-4be9b4b070f7"
                leftMenuGuid="46c065f9-16cc-4b8b-9f22-421177576460"
            >
                <Heading level={1}>Menu Edit</Heading>
                <Form>
                    <Field label="GUID" size={3}><Input
                        readonly={true}
                        value={this.state.model.guid}
                    /></Field>
                    <Field label="Display" size={3}><Input
                        value={this.state.model.displayName}
                        onChange={async (value) => {
                            const newModel = this.jsonCopy(this.state.model);;
                            newModel.displayName = value;
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