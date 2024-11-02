import * as React from "react";
import { createRoot } from "react-dom/client";
import { Dialogue, ErrorMessage, Navigation } from "../../tre/components/Navigation";
import { BasePage, BasePageState } from "../../tre/components/BasePage";
import { Heading } from "../../tre/components/Heading";
import { Field } from "../../tre/components/Field";
import { UUIDv4 } from "common/src/tre/logic/UUIDv4";
import { AuthService } from "../services/AuthService";
import { Form } from "../../tre/components/Form";
import { Input } from "../../tre/components/Input";
import { Button } from "../../tre/components/Button";
import { FlexRow } from "../../tre/components/FlexRow";
import { UserDto } from "common/src/tre/models/UserDto";
import { UserService } from "../services/UserService";

interface Props { }
interface State extends BasePageState {
    model: UserDto;
    newPassword: string;
    confirmPassword: string;
}

/**
 * Page class for User Edit
 */
class Page extends BasePage<Props, State> {
    /**
     * Constructor for the Page class
     * @param props - Component props
     */
    public constructor(props: Props) {
        super(props);

        this.state = {
            ...BasePage.defaultState,
            model: {
                displayName: "",
                guid: UUIDv4.generate(),
                emailAddress: "",
                smsPhone: ""
            },
            newPassword: "",
            confirmPassword: ""
        };
    }

    /**
     * Life cycle method that is called after the component is mounted
     */
    public async componentDidMount(): Promise<void> {
        await this.events.setLoading(true);

        const guid = this.queryString("guid");
        if (!guid) {
            await this.events.setLoading(false);
            return;
        }

        const token = await AuthService.getToken();

        const model = await UserService.get(token, guid);
        await this.updateState({ model: model });
        await this.events.setLoading(false);
    }

    /**
     * Method called when the save button is clicked
     */
    public async saveClicked() {
        this.events.setLoading(true);
        try {
            const token = await AuthService.getToken();
            await UserService.save(token, this.state.model);
            window.location.replace("user.html?guid=" + this.state.model.guid);
            return;
        }
        catch (err) {
            await ErrorMessage(this, err);
            await this.events.setLoading(false);
        }
    }

    /**
     * Method called when the delete button is clicked
     */
    public async deleteClicked() {
        this.events.setLoading(true);
        try {
            const token = await AuthService.getToken();
            await UserService.delete(token, this.state.model.guid);
            window.history.back();
            return;
        }
        catch (err) {
            await ErrorMessage(this, err);
            await this.events.setLoading(false);
        }
    }

    /**
     * Method called when the change password button is clicked
     */
    public async changeClicked() {
        this.events.setLoading(true);
        try {
            const token = await AuthService.getToken();
            await UserService.resetPassword(
                token,
                this.state.model.guid,
                this.state.newPassword,
                this.state.confirmPassword
            );
            await this.events.setLoading(false);
            await this.updateState({ newPassword: "", confirmPassword: "" });
            await Dialogue(this, "Success", "The users password has been changed.", ["OK"]);
        }
        catch (err) {
            await ErrorMessage(this, err);
            await this.events.setLoading(false);
        }
    }

    /**
     * Render method for the Page class
     * @returns JSX to render
     */
    public render(): React.ReactNode {
        return (
            <Navigation
                state={this.state} events={this.events}
                topMenuGuid="b1e3c680-0f62-4931-8a68-4be9b4b070f7"
                leftMenuGuid="67fa4231-5b8e-4639-89cb-5f15a9207a83"
            >
                <Heading level={1}>User Edit</Heading>
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
                    <Field label="Email" size={2}><Input
                        value={this.state.model.emailAddress}
                        onChange={async (value) => {
                            const newModel = this.jsonCopy(this.state.model);;
                            newModel.emailAddress = value;
                            await this.updateState({ model: newModel });
                        }}
                    /></Field>
                    <Field label="Cell Phone" size={2}><Input
                        value={this.state.model.smsPhone}
                        onChange={async (value) => {
                            const newModel = this.jsonCopy(this.state.model);;
                            newModel.smsPhone = value;
                            await this.updateState({ model: newModel });
                        }}
                    /></Field>
                </Form>
                <FlexRow gap="1em">
                    <Button label="Save" onClick={this.saveClicked.bind(this)} />
                    <Button label="Delete" onClick={this.deleteClicked.bind(this)} />
                </FlexRow>

                <Heading level={2}>Reset Password</Heading>
                <Form>
                    <Field label="Password" size={2}><Input password={true}
                        value={this.state.newPassword}
                        onChange={async (value) => {
                            await this.updateState({ newPassword: value });
                        }}
                    /></Field>
                    <Field label="Confirm" size={2}><Input password={true}
                        value={this.state.confirmPassword}
                        onChange={async (value) => {
                            await this.updateState({ confirmPassword: value });
                        }}
                    /></Field>
                </Form>
                <FlexRow gap="1em">
                    <Button label="Change" onClick={this.changeClicked.bind(this)} />
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
