import * as React from "react";
import { createRoot } from "react-dom/client";
import { Dialogue, Navigation } from "../components/Navigation";
import { BasePage, BasePageState } from "../components/BasePage";
import { Heading } from "../components/Heading";
import { Dictionary } from "common/src/Dictionary";
import { Form } from "../components/Form";
import { Field } from "../components/Field";
import { Select } from "../components/Select";
import { AuthService } from "../services/AuthService";
import { GroupDto } from "common/src/models/GroupDto";
import { SelectOption } from "../components/SelectOption";
import { GroupService } from "../services/GroupService";
import { Button } from "../components/Button";
import { FlexRow } from "../components/FlexRow";
import { Checkbox } from "../components/Checkbox";
import { SecurableDto } from "common/src/models/SecurableDto";
import { PermissionDto } from "common/src/models/PermissionDto";
import { SecurableService } from "../services/SecurableService";
import { PermissionService } from "../services/PermissionService";
import { GroupLogic } from "common/src/logic/GroupLogic";
import { SecurableLogic } from "common/src/logic/SecurableLogic";

interface Props { }
interface State extends BasePageState {
    securableMap: Dictionary<SecurableDto>;
    securableOptions: React.ReactElement[];
    groupMap: Dictionary<GroupDto>;
    groupOptions: React.ReactElement[];
    models: PermissionDto[];
    selectedSecurable: string | null;
    selectedGroup: string | null;
}

class Page extends BasePage<Props, State> {
    /**
     * Constructor for the Page class.
     * @param props - Component props.
     */
    public constructor(props: Props) {
        super(props);

        this.state = {
            ...BasePage.defaultState,
            securableMap: {},
            securableOptions: [],
            groupMap: {},
            groupOptions: [],
            models: [],
            selectedGroup: "",
            selectedSecurable: ""
        };
    }

    /**
     * Lifecycle method that is called after the component is mounted.
     * Fetches the securables and groups and updates the component state.
     */
    public async componentDidMount(): Promise<void> {
        await this.events.setLoading(true);

        const token = await AuthService.getToken();

        const users = await SecurableService.list(token);
        users.sort(SecurableLogic.compareDisplayName);
        const userMap: Dictionary<SecurableDto> = {};
        const userOptions: React.ReactElement[] = [];
        userOptions.push(<SelectOption display="" value="" />);
        users.forEach((securable) => {
            userMap[securable.guid] = securable;
            userOptions.push(<SelectOption display={securable.displayName} value={securable.guid} />);
        });

        const groups = await GroupService.list(token);
        groups.sort(GroupLogic.compareDisplayName);
        const groupMap: Dictionary<GroupDto> = {};
        const groupOptions: React.ReactElement[] = [];
        groupOptions.push(<SelectOption display="" value="" />);
        groups.forEach((group) => {
            groupMap[group.guid] = group;
            groupOptions.push(<SelectOption display={group.displayName} value={group.guid} />);
        });

        await this.updateState({
            securableMap: userMap,
            securableOptions: userOptions,
            groupMap: groupMap,
            groupOptions: groupOptions
        });

        await this.events.setLoading(false);
    }

    /**
     * Loads permissions based on the selected group or securable.
     */
    private async loadClicked() {
        if (!this.state.selectedGroup && !this.state.selectedSecurable) {
            await Dialogue(this, "Notice", "No selections for securable or group were made!", ["OK"]);
            return;
        }

        await this.events.setLoading(true);

        const token = await AuthService.getToken();

        let permissions: PermissionDto[] = [];
        if (this.state.selectedGroup)
            permissions = await PermissionService.getForGroup(token, this.state.selectedGroup);
        else
            permissions = await PermissionService.getForSecurable(token, this.state.selectedSecurable);

        await this.updateState({ models: permissions });

        await this.events.setLoading(false);
    }

    /**
     * Saves the permissions that have been modified.
     */
    private async saveClicked() {
        await this.events.setLoading(true);

        const token = await AuthService.getToken();

        const promises: Promise<void>[] = [];
        this.state.models.forEach((model) => {
            promises.push(PermissionService.save(token, model));
        });
        await Promise.all(promises);

        await this.loadClicked();

        await this.events.setLoading(false);
    }

    /**
     * Renders the component.
     * @returns The JSX to render.
     */
    public render(): React.ReactNode {
        const rows: React.ReactElement[] = [];
        this.state.models.forEach((model) => {
            if (!this.state.groupMap[model.groupsGuid] || !this.state.securableMap[model.securablesGuid])
                return;

            rows.push(<tr key={model.guid}>
                <td>{this.state.groupMap[model.groupsGuid].displayName}</td>
                <td>{this.state.securableMap[model.securablesGuid].displayName}</td>
                <td><Checkbox
                    checked={model.isAllowed}
                    onChange={async (value) => {
                        const newModels = this.jsonCopy(this.state.models);
                        newModels.forEach((newModel) => {
                            if (newModel.guid === model.guid)
                                newModel.isAllowed = value;
                        });
                        await this.updateState({ models: newModels });
                    }}
                /></td>
            </tr>);
        });

        return (
            <Navigation
                state={this.state} events={this.events}
                topMenuGuid="b1e3c680-0f62-4931-8a68-4be9b4b070f7"
                leftMenuGuid="9cba8197-65ed-42ed-a37c-f8a4e2f774e2"
            >
                <Heading level={1}>Permissions</Heading>
                <Form>
                    <Field label="Securable" size={3}><Select
                        value={this.state.selectedSecurable}
                        onChange={async (value) => {
                            await this.updateState({
                                selectedSecurable: value,
                                selectedGroup: ""
                            })
                        }}
                    >{this.state.securableOptions}</Select></Field>
                    <Field label="Group" size={2}><Select
                        value={this.state.selectedGroup}
                        onChange={async (value) => {
                            await this.updateState({
                                selectedSecurable: "",
                                selectedGroup: value
                            })
                        }}
                    >{this.state.groupOptions}</Select></Field>
                </Form>
                <FlexRow gap="1em">
                    <Button label="Load" onClick={this.loadClicked.bind(this)} />
                </FlexRow>
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Group</th>
                                <th>User</th>
                                <th>Included</th>
                            </tr>
                        </thead>
                        <tbody>{rows}</tbody>
                    </table>
                </div>
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
