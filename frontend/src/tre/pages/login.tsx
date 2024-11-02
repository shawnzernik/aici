import * as React from "react";
import { createRoot } from "react-dom/client";
import { Heading } from "../../tre/components/Heading";
import { ErrorMessage, Navigation } from "../../tre/components/Navigation";
import { BasePage, BasePageState } from "../../tre/components/BasePage";
import { Form } from "../../tre/components/Form";
import { LoginDto } from "common/src/tre/models/LoginDto";
import { Field } from "../../tre/components/Field";
import { Input } from "../../tre/components/Input";
import { Button } from "../../tre/components/Button";
import { AuthService } from "../services/AuthService";
import { FlexRow } from "../../tre/components/FlexRow";

interface Props { }

interface State extends BasePageState {
    model: LoginDto; // Holds the login form data
}

/**
 * Represents the login page.
 * Inherits from BasePage to utilize shared page functionality.
 */
class Page extends BasePage<Props, State> {

    /**
     * Constructs a new instance of the Page class.
     * Initializes the state with default values and sets the AuthService token to an empty string.
     * @param props The properties passed to the component.
     */
    public constructor(props: Props) {
        super(props);

        this.state = {
            ...BasePage.defaultState,
            model: {
                emailAddress: "",
                password: ""
            }
        };

        AuthService.setToken("");
    }

    /**
     * Handles the login process.
     * Sets the loading state, retrieves the token from AuthService, and redirects to the copyright page.
     * @returns A promise that resolves when the login process is complete.
     */
    public async login(): Promise<void> {
        await this.events.setLoading(true);

        try {
            const token = await AuthService.login(this.state.model.emailAddress, this.state.model.password);
            AuthService.setToken(token);
            window.location.assign("copyright.html");
        }
        catch (err) {
            await ErrorMessage(this, err);
        }
        await this.events.setLoading(false);
    }

    /**
     * Renders the login page.
     * Constructs the UI components and binds the necessary event handlers.
     * @returns The rendered React nodes.
     */
    public render(): React.ReactNode {
        return (
            <Navigation
                state={this.state} events={this.events}
                topMenuGuid="b9aeb1c2-4f07-4e91-bbef-25ed565b6ab3"
                leftMenuGuid="db0d6063-2266-4bfb-8c96-44dbb90cddf2"
                showMenu={false}
            >
                <Heading level={1}>Login</Heading>
                <Form>
                    <Field size={2} label="Email Address"><Input
                        value={this.state.model.emailAddress}
                        onChange={async (value) => {
                            const newModel = JSON.parse(JSON.stringify(this.state.model));
                            newModel.emailAddress = value;
                            await this.updateState({ model: newModel });
                        }}
                    /></Field>
                    <Field size={2} label="Password"><Input
                        password={true}
                        value={this.state.model.password}
                        onChange={async (value) => {
                            const newModel = JSON.parse(JSON.stringify(this.state.model));
                            newModel.password = value;
                            await this.updateState({ model: newModel });
                        }}
                    /></Field>
                </Form>
                <FlexRow gap="1em">
                    <Button label="Login" onClick={this.login.bind(this)} />
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
