import * as React from "react";
import { createRoot } from "react-dom/client";
import { Dictionary } from "common/src/tre/Dictionary";
import { UUIDv4 } from "common/src/tre/logic/UUIDv4";
import { ErrorMessage, Navigation } from "../../tre/components/Navigation";
import { BasePage, BasePageState } from "../../tre/components/BasePage";
import { Heading } from "../../tre/components/Heading";
import { Form } from "../../tre/components/Form";
import { Field } from "../../tre/components/Field";
import { Input } from "../../tre/components/Input";
import { Button } from "../../tre/components/Button";
import { Checkbox } from "../../tre/components/Checkbox";
import { SelectOption } from "../../tre/components/SelectOption";
import { Select } from "../../tre/components/Select";
import { TextArea } from "../../tre/components/TextArea";
import { FlexRow } from "../../tre/components/FlexRow";
import { ListDto } from "common/src/tre/models/ListDto";
import { MenuDto } from "common/src/tre/models/MenuDto";
import { ListService } from "../services/ListService";
import { AuthService } from "../services/AuthService";
import { MenuService } from "../services/MenuService";
import { MenuLogic } from "common/src/tre/logic/MenuLogic";
import { ListFilterService } from "../services/ListFilterService";
import { ListFilterDto } from "common/src/tre/models/ListFilterDto";
import { ListFilterEditList } from "../subpages/ListFilterEditList";

interface Props { }

/**
 * Page component for managing lists.
 */
interface State extends BasePageState {
    model: ListDto;
    filters: ListFilterDto[];
    showAddFilterButton: boolean;
}

/**
 * Page class for managing the list creation and editing.
 */
class Page extends BasePage<Props, State> {
    /** Top menu options for the select component */
    private topMenuOptions: React.ReactElement[] = [];

    /** Left menu options for the select component */
    private leftMenuOptions: React.ReactElement[] = [];

    /**
     * Creates an instance of Page.
     * @param props - Component props
     */
    public constructor(props: Props) {
        super(props);

        this.state = {
            ...BasePage.defaultState,
            model: {
                autoload: false,
                guid: UUIDv4.generate(),
                leftMenuGuid: "",
                topMenuGuid: "",
                title: "",
                sql: "",
                urlKey: "",
                editUrl: ""
            },
            filters: [],
            showAddFilterButton: false
        };
    }

    /**
     * Lifecycle method that is called after the component is mounted.
     */
    public async componentDidMount(): Promise<void> {
        this.events.setLoading(true);

        // load all menus
        const token = await AuthService.getToken();
        let menus = await MenuService.list(token);

        // create & organize top menu data
        const topMenuDictionary: Dictionary<MenuDto> = {};
        const topMenuList: MenuDto[] = [];
        menus.forEach((menu) => {
            if (menu.parentsGuid)
                return;

            topMenuDictionary[menu.guid] = menu;
            topMenuList.push(menu);
        });
        topMenuList.sort(MenuLogic.compareDisplay);

        // create & organize left menu data
        const leftMenuList: MenuDto[] = [];
        menus.forEach((menu) => {
            if (!menu.parentsGuid)
                return;

            menu.display = topMenuDictionary[menu.parentsGuid].display + " > " + menu.display;
            leftMenuList.push(menu);
        });
        leftMenuList.sort(MenuLogic.compareDisplay);

        // load select options
        this.topMenuOptions.push(<SelectOption key="" display="" value="" />);
        topMenuList.forEach((menu, index) => {
            this.topMenuOptions.push(<SelectOption key={menu.guid} display={menu.display} value={menu.guid} />);
        });
        this.leftMenuOptions.push(<SelectOption key="" display="" value="" />);
        leftMenuList.forEach((menu, index) => {
            this.leftMenuOptions.push(<SelectOption key={menu.guid} display={menu.display} value={menu.guid} />);
        });

        // if no guid provided, skip loading list item
        const guid = this.queryString("guid");
        if (!guid) {
            this.events.setLoading(false);
            return;
        }

        // load models
        const model = await ListService.get(token, guid);
        const filters = await ListFilterService.listByParentList(token, guid);
        await this.updateState({
            model: model,
            filters: filters,
            showAddFilterButton: true
        });
        this.events.setLoading(false);
    }

    /**
     * Handles the save button click event.
     */
    public async saveClicked(filterToDelete?: ListFilterDto) {
        this.events.setLoading(true);
        try {
            const token = await AuthService.getToken();

            const promises: Promise<void>[] = [];
            promises.push(ListService.save(token, this.state.model));

            for (const filter of this.state.filters)
                if (filterToDelete.guid == filter.guid)
                    promises.push(ListFilterService.delete(token, filterToDelete.guid))
                else
                    promises.push(ListFilterService.save(token, filter));

            await Promise.all(promises);

            window.location.replace("/static/tre/pages/list.html?guid=" + this.state.model.guid);
            return;
        }
        catch (err) {
            await ErrorMessage(this, err);
            await this.events.setLoading(false);
        }
    }

    /**
     * Handles the delete button click event.
     */
    public async deleteClicked() {
        this.events.setLoading(true);
        try {
            const token = await AuthService.getToken();
            await ListService.delete(token, this.state.model.guid);
            window.history.back();
            return;
        }
        catch (err) {
            await ErrorMessage(this, err);
            await this.events.setLoading(false);
        }
    }

    public addFilterClicked() {
        const newFilters = this.jsonCopy(this.state.filters);
        newFilters.push({
            guid: UUIDv4.generate(),
            label: "",
            listsGuid: this.state.model.guid,
            sqlColumn: "",
            sqlType: "",
            defaultCompare: "",
            defaultValue: "",
            optionsSql: ""
        });
        this.updateState({
            filters: newFilters
        });
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
                leftMenuGuid="e1b4b1c6-0c4f-4a62-9c8f-8c8f3b9a4d61"
            >
                <Heading level={1}>List Edit</Heading>
                <Form>
                    <Field label="GUID" size={3}><Input
                        readonly={true}
                        value={this.state.model.guid}
                    /></Field>
                    <Field label="Title"><Input
                        value={this.state.model.title}
                        onChange={async (value) => {
                            const newModel = JSON.parse(JSON.stringify(this.state.model));
                            newModel.title = value;
                            await this.updateState({ model: newModel });
                        }}
                    /></Field>
                    <Field label="SQL"><TextArea
                        monospace={true}
                        showAll={true}
                        value={this.state.model.sql}
                        onChange={async (value) => {
                            const newModel = JSON.parse(JSON.stringify(this.state.model));
                            newModel.sql = value;
                            await this.updateState({ model: newModel });
                        }}
                    /></Field>
                    <Field label="URL Key" size={1}><Input
                        value={this.state.model.urlKey}
                        onChange={async (value) => {
                            const newModel = JSON.parse(JSON.stringify(this.state.model));
                            newModel.urlKey = value;
                            await this.updateState({ model: newModel });
                        }}
                    /></Field>
                    <Field label="Top Menu" size={1}>
                        <Select
                            value={this.state.model.topMenuGuid}
                            onChange={async (value) => {
                                const newModel = JSON.parse(JSON.stringify(this.state.model));
                                newModel.topMenuGuid = value;
                                await this.updateState({ model: newModel });
                            }}
                        >{this.topMenuOptions}</Select>
                    </Field>
                    <Field label="Left Menu" size={2}>
                        <Select
                            value={this.state.model.leftMenuGuid}
                            onChange={async (value) => {
                                const newModel = JSON.parse(JSON.stringify(this.state.model));
                                newModel.leftMenuGuid = value;
                                await this.updateState({ model: newModel });
                            }}
                        >{this.leftMenuOptions}</Select>
                    </Field>
                    <Field label="Edit URL" size={3}><Input
                        value={this.state.model.editUrl}
                        onChange={async (value) => {
                            const newModel = JSON.parse(JSON.stringify(this.state.model));
                            newModel.editUrl = value;
                            await this.updateState({ model: newModel });
                        }}
                    /></Field>
                    <Field label="Autoload" size={1}><Checkbox
                        checked={this.state.model.autoload}
                        onChange={async (value) => {
                            const newModel = JSON.parse(JSON.stringify(this.state.model));
                            newModel.autoload = value;
                            await this.updateState({ model: newModel });
                        }}
                    /></Field>
                </Form>
                <FlexRow gap="1em">
                    <Button label="Save" onClick={this.saveClicked.bind(this)} />
                    {
                        this.state.showAddFilterButton
                            ? <Button label="Add Filter" onClick={this.addFilterClicked.bind(this)} />
                            : null
                    }
                    <Button label="Delete" onClick={this.deleteClicked.bind(this)} />
                </FlexRow>
                <ListFilterEditList
                    value={this.state.filters}
                    onChange={async (list) => {
                        await this.updateState({ filters: list });
                    }}
                    onDelete={this.saveClicked.bind(this)}
                />
            </Navigation >
        );
    }
}

/** 
 * Window onload event to render the Page component.
 */
window.onload = () => {
    const element = document.getElementById('root');
    const root = createRoot(element);
    root.render(<Page />)
};

/** 
 * Window onpageshow event to reload the page if it was restored from the back-forward cache.
 */
window.onpageshow = (event) => {
    if (event.persisted) {
        window.location.reload();
    }
};
