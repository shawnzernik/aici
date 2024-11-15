import * as React from "react";
import { createRoot } from "react-dom/client";
import { ErrorMessage, Navigation } from "../../tre/components/Navigation";
import { BasePage, BasePageState } from "../../tre/components/BasePage";
import { Heading } from "../../tre/components/Heading";
import { Form } from "../../tre/components/Form";
import { Field } from "../../tre/components/Field";
import { Input } from "../../tre/components/Input";
import { MenuDto } from "common/src/tre/models/MenuDto";
import { UUIDv4 } from "common/src/tre/logic/UUIDv4";
import { FlexRow } from "../../tre/components/FlexRow";
import { Button } from "../../tre/components/Button";
import { SelectOption } from "../../tre/components/SelectOption";
import { MenuService } from "../services/MenuService";
import { MenuLogic } from "common/src/tre/logic/MenuLogic";
import { AuthService } from "../services/AuthService";
import { Select } from "../../tre/components/Select";

interface Props { }
interface State extends BasePageState {
    model: MenuDto;
    menuOptions: React.ReactElement[];
}

class Page extends BasePage<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            ...BasePage.defaultState,
            model: {
                bootstrapIcon: "app",
                display: "",
                guid: UUIDv4.generate(),
                order: 1,
                url: "",
                parentsGuid: ""
            },
            menuOptions: []
        }
    }

    public async componentDidMount(): Promise<void> {
        await this.events.setLoading(true);

        const token = await AuthService.getToken();

        const menus = await MenuService.list(token);
        let rootMenus: MenuDto[] = [];
        menus.forEach((menu) => {
            if (!menu.parentsGuid)
                rootMenus.push(menu);
        });
        rootMenus = rootMenus.sort(MenuLogic.compareDisplay);

        const menuOptions: React.ReactElement[] = [];
        menuOptions.push(<SelectOption display="" value="" />);
        rootMenus.forEach((menu) => {
            menuOptions.push(<SelectOption display={menu.display} value={menu.guid} />);
        });
        await this.updateState({ menuOptions: menuOptions });

        const guid = this.queryString("guid");
        if (!guid) {
            await this.events.setLoading(false);
            return;
        }

        const menu = await MenuService.get(token, guid);
        await this.updateState({ model: menu });

        await this.events.setLoading(false);
    }

    public async saveClicked() {
        this.events.setLoading(true);
        try {
            const tempModel = this.jsonCopy(this.state.model);
            if (tempModel.parentsGuid === "")
                tempModel.parentsGuid = null;

            const token = await AuthService.getToken();
            await MenuService.save(token, tempModel);
            window.location.replace("menu.html?guid=" + this.state.model.guid);
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
            await MenuService.delete(token, this.state.model.guid);
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
                leftMenuGuid="35697b22-5894-44e7-b574-d0cf7f63af80"
            >
                <Heading level={1}>Menu Edit</Heading>
                <Form>
                    <Field label="GUID" size={3}><Input
                        readonly={true}
                        value={this.state.model.guid}
                    /></Field>
                    <Field label="Parent" size={2}>
                        <Select
                            value={this.state.model.parentsGuid}
                            onChange={async (value) => {
                                const newModel = this.jsonCopy(this.state.model);;
                                newModel.parentsGuid = value;
                                await this.updateState({ model: newModel });
                            }}
                        >{this.state.menuOptions}</Select>
                    </Field>
                    <Field label="Order" size={1}><Input
                        value={this.state.model.order.toString()}
                        onChange={async (value) => {
                            const newModel = this.jsonCopy(this.state.model);;
                            newModel.order = Number.parseInt(value);
                            await this.updateState({ model: newModel });
                        }}
                    /></Field>
                    <Field label="Display" size={2}><Input
                        value={this.state.model.display}
                        onChange={async (value) => {
                            const newModel = this.jsonCopy(this.state.model);;
                            newModel.display = value;
                            await this.updateState({ model: newModel });
                        }}
                    /></Field>
                    <Field label="Icon" size={2}><Input
                        value={this.state.model.bootstrapIcon}
                        onChange={async (value) => {
                            const newModel = this.jsonCopy(this.state.model);;
                            newModel.bootstrapIcon = value;
                            await this.updateState({ model: newModel });
                        }}
                    /></Field>
                    <Field label="URL" size={3}><Input
                        value={this.state.model.url}
                        onChange={async (value) => {
                            const newModel = this.jsonCopy(this.state.model);;
                            newModel.url = value;
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
