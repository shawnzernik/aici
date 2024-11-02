import * as React from "react";
import { createRoot } from "react-dom/client";
import { ErrorMessage, Navigation } from "../../tre/components/Navigation";
import { BasePage, BasePageState } from "../../tre/components/BasePage";
import { Heading } from "../../tre/components/Heading";
import { Form } from "../../tre/components/Form";
import { Field } from "../../tre/components/Field";
import { Input } from "../../tre/components/Input";
import { FinetuneDto } from "common/src/app/models/FinetuneDto";
import { UUIDv4 } from "common/src/tre/logic/UUIDv4";
import { FinetuneService } from "../services/FinetuneService";
import { AuthService } from "../../tre/services/AuthService";
import { Button } from "../../tre/components/Button";
import { FlexRow } from "../../tre/components/FlexRow";

interface Props { }
interface State extends BasePageState {
    model: FinetuneDto;
}

/**
 * Page component for editing a finetune model.
 */
class Page extends BasePage<Props, State> {
    /**
     * Constructs the Page component.
     * @param props - Props for the component.
     */
    public constructor(props: Props) {
        super(props);

        this.state = {
            ...BasePage.defaultState,
            model: {
                guid: UUIDv4.generate(),
                displayName: "",
                suffix: "",
                id: "",
                model: "gpt-4o-mini-2024-07-18",
                learningRateMultiplier: 1.8,
                batchSize: 32,
                epochs: 10,
                seed: 1,
                trainingFile: "",
                trainingData: "",
                validationFile: "",
                validationData: ""
            }
        };
    }

    /**
     * Lifecycle method that is called after the component is mounted.
     */
    public async componentDidMount(): Promise<void> {
        this.events.setLoading(true);

        const token = await AuthService.getToken();
        const guid = this.queryString("guid");
        if (!guid) {
            this.events.setLoading(false);
            return;
        }

        const model = await FinetuneService.get(token, guid);
        await this.updateState({ model: model });
        this.events.setLoading(false);
    }

    /**
     * Handler for the save button click event.
     */
    public async saveClicked() {
        this.events.setLoading(true);
        try {
            const token = await AuthService.getToken();
            await FinetuneService.save(token, this.state.model);
            window.location.replace("/static/pages/finetune.html?guid=" + this.state.model.guid);
            return;
        }
        catch (err) {
            await ErrorMessage(this, err);
            await this.events.setLoading(false);
        }
    }

    /**
     * Handler for the delete button click event.
     */
    public async deleteClicked() {
        this.events.setLoading(true);
        try {
            const token = await AuthService.getToken();
            await FinetuneService.delete(token, this.state.model.guid);
            window.history.back();
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
                topMenuGuid="a4b3b92f-3037-4780-a5c2-3d9d85d6b5a4"
                leftMenuGuid="1a5073f4-5be7-4b01-af23-11aff07485f3"
            >
                <Heading level={1}>Finetune Edit</Heading>
                <Form>
                    <Field label="GUID" size={3}><Input
                        readonly={true}
                        value={this.state.model.guid}
                    /></Field>
                    <Field label="Display Name" size={2}><Input
                        value={this.state.model.displayName}
                        onChange={async (value) => {
                            const newModel = { ...this.state.model, displayName: value };
                            await this.updateState({ model: newModel });
                        }}
                    /></Field>
                    <Field label="Suffix" size={1}><Input
                        value={this.state.model.suffix}
                        onChange={async (value) => {
                            const newModel = { ...this.state.model, suffix: value };
                            await this.updateState({ model: newModel });
                        }}
                    /></Field>
                    <Field label="Model" size={2}><Input
                        value={this.state.model.model}
                        onChange={async (value) => {
                            const newModel = { ...this.state.model, model: value };
                            await this.updateState({ model: newModel });
                        }}
                    /></Field>
                    <Field label="Epochs" size={1}><Input
                        value={this.state.model.epochs.toString()}
                        onChange={async (value) => {
                            const newModel = { ...this.state.model, epochs: Number.parseInt(value) };
                            await this.updateState({ model: newModel });
                        }}
                    /></Field>
                    <Field label="LRM" size={1}><Input
                        value={this.state.model.learningRateMultiplier.toString()}
                        onChange={async (value) => {
                            const newModel = { ...this.state.model, learningRateMultiplier: Number.parseFloat(value) };
                            await this.updateState({ model: newModel });
                        }}
                    /></Field>
                    <Field label="Batch Size" size={1}><Input
                        value={this.state.model.batchSize.toString()}
                        onChange={async (value) => {
                            const newModel = { ...this.state.model, batchSize: Number.parseInt(value) };
                            await this.updateState({ model: newModel });
                        }}
                    /></Field>
                    <Field label="Seed" size={1}><Input
                        value={this.state.model.seed.toString()}
                        onChange={async (value) => {
                            const newModel = { ...this.state.model, seed: Number.parseInt(value) };
                            await this.updateState({ model: newModel });
                        }}
                    /></Field>
                    <Field label="ID" size={2}><Input
                        value={this.state.model.id}
                    /></Field>
                    <Field label="Training File" size={2}><Input
                        value={this.state.model.trainingFile}
                    /></Field>
                    <Field label="Validation File" size={2}><Input
                        value={this.state.model.validationFile}
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
 * Window load event handler that renders the Page component.
 */
window.onload = () => {
    const element = document.getElementById("root");
    const root = createRoot(element);
    root.render(<Page />);
};

/**
 * Window page show event handler that reloads the page if it was restored from cache.
 * @param event - The event object.
 */
window.onpageshow = (event) => {
    if (event.persisted) {
        window.location.reload();
    }
};
