import * as React from "react";
import { createRoot } from "react-dom/client";
import { ErrorMessage, Navigation } from "../../tre/components/Navigation";
import { BasePage, BasePageState } from "../../tre/components/BasePage";
import { ListService } from "../services/ListService";
import { AuthService } from "../services/AuthService";
import { ListDto } from "common/src/tre/models/ListDto";
import { Heading } from "../../tre/components/Heading";
import { Table } from "../../tre/components/Table";
import { ListFilterService } from "../services/ListFilterService";
import { ListFilterDto } from "common/src/tre/models/ListFilterDto";
import { Form } from "../../tre/components/Form";
import { Field } from "../../tre/components/Field";
import { Select } from "../../tre/components/Select";
import { SelectOption } from "../../tre/components/SelectOption";
import { Dictionary } from "common/src/tre/Dictionary";
import { FlexRow } from "../../tre/components/FlexRow";
import { Button } from "../../tre/components/Button";
import { Input } from "../../tre/components/Input";
import { ListFilterOptions } from "../subpages/ListFilterCompareOptions";

interface Props { }
interface State extends BasePageState {
    items: any[];
    list?: ListDto;
    filtersByGuid: Dictionary<ListFilterDto>;
    selectedFilter: string;
    filterOptions: React.ReactElement[];
    filters: ListFilterDto[];
}

class Page extends BasePage<Props, State> {
    private searched = false;

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

    public async componentDidMount(): Promise<void> {
        this.events.setLoading(true);

        const token = await AuthService.getToken();
        const list = await ListService.getUrlKey(token, this.queryString("url_key"));
        let items = [];
        if (list.autoload || this.searched)
            items = await ListService.getItems(token, list.guid, this.state.filters);

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
        for (let cnt = 0; cnt < this.state.filters.length; cnt++) {
            const filter = this.state.filters[cnt];
            filters.push(
                <>
                    <Form>
                        <Field label={filter.label}>
                            <Select
                                value={filter.defaultCompare ? filter.defaultCompare : ""}
                                onChange={async (value) => {
                                    const newFilters = this.jsonCopy(this.state.filters);
                                    newFilters[cnt].defaultCompare = value;
                                    await this.updateState({ filters: newFilters });
                                }}
                            >{ListFilterOptions.forType(filter.sqlType)}</Select>
                            <Input
                                value={filter.defaultValue ? filter.defaultValue : ""}
                                onChange={async (value) => {
                                    const newFilters = this.jsonCopy(this.state.filters);
                                    newFilters[cnt].defaultValue = value;
                                    await this.updateState({ filters: newFilters });
                                }}
                            />
                            <Button label="Remove" onClick={async () => {
                                const newFilters: ListFilterDto[] = [];
                                this.state.filters.forEach((value, index) => {
                                    if (index != cnt)
                                        newFilters.push(value);
                                });
                                await this.updateState({ filters: newFilters });
                            }} />
                        </Field>
                    </Form>
                </>
            );
        }
        filters.push(
            <FlexRow gap="1em">
                <Button label="Search" onClick={async () => {
                    this.searched = true;
                    try {
                        await this.componentDidMount();
                    }
                    catch (err) {
                        await this.events.setLoading(false);
                        await ErrorMessage(this, err);
                    }
                }} />
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
                    <Field label="Filter">
                        <Select
                            onChange={async (value) => {
                                await this.updateState({ selectedFilter: value });
                            }}
                            value={this.state.selectedFilter}
                        >{this.state.filterOptions}</Select>
                        <Button label="Add&nbsp;Filter" onClick={this.addFilterClicked.bind(this)} />
                    </Field>
                </Form>
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
