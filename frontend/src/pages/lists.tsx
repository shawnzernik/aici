import * as React from "react";
import { createRoot } from "react-dom/client";
import { Navigation } from "../components/Navigation";
import { BasePage, BasePageState } from "../components/BasePage";
import { ListService } from "../services/ListService";
import { AuthService } from "../services/AuthService";
import { ListDto } from "common/src/models/ListDto";
import { Heading } from "../components/Heading";
import { Table } from "../components/Table";
import { ListFilterService } from "../services/ListFilterService";
import { ListFilterDto } from "common/src/models/ListFilterDto";
import { Form } from "../components/Form";
import { Field } from "../components/Field";
import { Select } from "../components/Select";
import { SelectOption } from "../components/SelectOption";
import { Dictionary } from "common/src/Dictionary";
import { FlexRow } from "../components/FlexRow";
import { Button } from "../components/Button";
import { Input } from "../components/Input";

interface Props { }
interface State extends BasePageState {
    items: any[];
    list?: ListDto;
    filtersByGuid: Dictionary<ListFilterDto>;
    selectedFilter: string;
    filterOptions: React.ReactElement[];
    filters: ListFilterDto[];
}

/**
 * Represents the Page component that displays a list of items.
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
            items: [],
            filtersByGuid: {},
            selectedFilter: "",
            filterOptions: [],
            filters: []
        };
    }

    /**
     * Lifecycle method that is called after the component is mounted.
     * Fetches the list and its items from the server.
     */
    public async componentDidMount(): Promise<void> {
        this.events.setLoading(true);

        const token = await AuthService.getToken();
        const list = await ListService.getUrlKey(token, this.queryString("url_key"));
        const items = await ListService.getItems(token, list.guid, []);

        const filters = await ListFilterService.listByParentList(token, list.guid);
        filters.sort((a, b) => {
            if (a.label < b.label) return -1;
            if (a.label == b.label) return 0;
            return 1;
        });

        const options: React.ReactElement[] = [];
        const filtersByGuid: Dictionary<ListFilterDto> = {};
        options.push(<SelectOption value="" display="" />);
        for (const filter of filters) {
            options.push(<SelectOption value={filter.guid} display={filter.label} />)
            filtersByGuid[filter.guid] = filter;
        }

        await this.updateState({
            list: list,
            items: items,
            filtersByGuid: filtersByGuid,
            filterOptions: options
        });

        this.events.setLoading(false);
    }

    private async addFilterClicked(): Promise<void> {
        const newFilter = this.jsonCopy(this.state.filtersByGuid[this.state.selectedFilter]);
        const filters = this.jsonCopy(this.state.filters);
        filters.push(newFilter);

        await this.updateState({ filters: filters });
    }

    /**
     * Renders the component.
     * @returns The rendered component.
     */
    public render(): React.ReactNode {
        if (!this.state.list || !this.state.items)
            return;

        let keys: string[] = [];
        if (this.state.items.length > 0)
            Object.keys(this.state.items[0]).forEach((key) => {
                if (key != "guid")
                    keys.push(key);
            });

        const headers: React.ReactNode[] = [];
        keys.forEach((key) => {
            headers.push(<th>{key}</th>);
        });

        const rows: React.ReactNode[] = [];
        this.state.items.forEach((item, index) => {
            const row: React.ReactNode[] = [];
            keys.forEach((key) => {
                row.push(<td>{item[key]}</td>);
            });
            rows.push(<tr>{row}</tr>);
        });

        const filters: React.ReactElement[] = [];
        for (const filter of this.state.filters)
            filters.push(
                <>
                    <Form>
                        <Field label={filter.label}>
                            <Select />
                            <Input />
                        </Field>
                    </Form>
                </>
            );
        if (filters.length > 0)
            filters.push(
                <FlexRow gap="1em">
                    <Button label="Search" onClick={() => { }} />
                </FlexRow>
            );

        return (
            <Navigation
                state={this.state} events={this.events}
                topMenuGuid={this.state.list.topMenuGuid}
                leftMenuGuid={this.state.list.leftMenuGuid}
            >
                <Heading level={1}>{this.state.list.title}</Heading>
                <Form>
                    <Field label="Filter"><Select
                        onChange={async (value) => {
                            await this.updateState({ selectedFilter: value });
                        }}
                        value={this.state.selectedFilter}
                    >{this.state.filterOptions}</Select></Field>
                </Form>
                <FlexRow gap="1em">
                    <Button label="Add Filter" onClick={this.addFilterClicked.bind(this)} />
                </FlexRow>
                {filters}
                <Table
                    items={this.state.items}
                    primaryKey="guid"
                    addUrl={this.state.list.editUrl}
                    editUrl={this.state.list.editUrl}
                />
            </Navigation>
        );
    }
}

/**
 * Initializes the Page component and renders it.
 */
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
