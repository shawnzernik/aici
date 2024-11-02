import * as React from "react";
import { createRoot } from "react-dom/client";
import { Dialogue, ErrorMessage, Navigation } from "../../tre/components/Navigation";
import { BasePage, BasePageState } from "../../tre/components/BasePage";
import { Heading } from "../../tre/components/Heading";
import { Form } from "../../tre/components/Form";
import { Field } from "../../tre/components/Field";
import { Input } from "../../tre/components/Input";
import { Button } from "../../tre/components/Button";
import { FlexRow } from "../../tre/components/FlexRow";
import { UserDto } from "common/src/tre/models/UserDto";
import { AuthService } from "../services/AuthService";

/**
 * Properties required by Account page.
 */
interface Props { }
/**
 * State used by Account properties.
 */
interface State extends BasePageState {
    model: UserDto,
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
}

/** 
 * Account page component class
 */
class Page extends BasePage<Props, State> {
    /** Constructor initializes state properties */
    public constructor(props: Props) {
        super(props);

        this.state = {
            ...BasePage.defaultState,
            model: {
                guid: "",
                displayName: "",
                emailAddress: "",
                smsPhone: ""
            },
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        };
    }

    /** 
     * Lifecycle method called after component mounts 
     */
    public async componentDidMount(): Promise<void> {
        await this.events.setLoading(true);

        try {
            const user = await AuthService.getUser();
            await this.updateState({ model: user });
            await this.events.setLoading(false);
        }
        catch (err) {
            await ErrorMessage(this, err);
        }
    }

    /** 
     * Saves the user information 
     */
    public async saveClicked(): Promise<void> {
        await this.events.setLoading(true);

        try {
            await AuthService.postUser(this.state.model);
            await this.componentDidMount();
            await this.events.setLoading(false);
            await Dialogue(this, "Success", "Changes have been saved!  You should log out and log back in for your changes to take effect.", ["OK"]);
        }
        catch (err) {
            await ErrorMessage(this, err);
        }
    }

    /** 
     * Changes the user's password 
     */
    public async changeClicked(): Promise<void> {
        await this.events.setLoading(true);

        try {
            await AuthService.postPassword(this.state.currentPassword, this.state.confirmPassword, this.state.newPassword);
            await this.events.setLoading(false);
            await Dialogue(this, "Success", "Your password has been changed.", ["OK"]);
        }
        catch (err) {
            await ErrorMessage(this, err);
        }
    }

    /** 
     * Renders the account page 
     */
    public render(): React.ReactNode {
        return (
            <Navigation
                state={this.state} events={this.events}
                topMenuGuid="b9aeb1c2-4f07-4e91-bbef-25ed565b6ab3"
                leftMenuGuid="c30341f3-f40e-4f94-96e5-1e63f9ac899e"
            >
                <Heading level={1}>My Account</Heading>
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
                </FlexRow>

                <Heading level={2}>Change Password</Heading>
                <Form>
                    <Field label="Current Password" size={2}><Input password={true}
                        value={this.state.currentPassword}
                        onChange={async (value) => {
                            await this.updateState({ currentPassword: value });
                        }}
                    /></Field>
                    <Field label="New Password" size={2}><Input password={true}
                        value={this.state.newPassword}
                        onChange={async (value) => {
                            await this.updateState({ newPassword: value });
                        }}
                    /></Field>
                    <Field label="Confirm Password" size={2}><Input password={true}
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

    /** 
     * Sets up the component for rendering 
     */
    public async setUpComponent(): Promise<void> {
        await this.componentDidMount();
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
