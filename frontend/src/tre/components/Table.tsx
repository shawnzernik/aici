import * as React from "react";
import { TableTheme } from "./TableTheme";
import { BootstrapIcon } from "./BootstrapIcon";
import { Button } from "./Button";
import { Checkbox } from "./Checkbox";
import { BasePage } from "./BasePage";

interface Props {
    items: any[];
    primaryKey: string;
    editUrl?: string;
    addUrl?: string;
}
interface State { }

export class Table extends React.Component<Props, State> {

    public render(): React.ReactNode {
        if (!this.props.items)
            return;

        let items = BasePage.jsonCopy(this.props.items);

        let dataLoaded = true;
        if (items.length == 0) {
            items.push({ "Table": "No data loaded!" })
            dataLoaded = false;
        }

        const keys: string[] = [];
        if (items.length > 0) {
            Object.keys(items[0]).forEach((key) => {
                if (key != this.props.primaryKey)
                    keys.push(key);
            });
        }

        const headers: React.ReactNode[] = [];
        if (this.props.editUrl && dataLoaded)
            headers.push(<th style={TableTheme.tableHeadTd}></th>);
        keys.forEach((key) => {
            headers.push(<th style={TableTheme.tableHeadTd}>{key}</th>);
        });

        const rows: React.ReactNode[] = [];
        items.forEach((item, index) => {
            const row: React.ReactNode[] = [];

            if (this.props.editUrl && dataLoaded)
                row.push(<td
                    style={{ ...TableTheme.tableRowTd, textAlign: "center", cursor: "pointer" }}
                    onClick={() => {
                        window.location.assign(this.props.editUrl + "?" + this.props.primaryKey + "=" + item[this.props.primaryKey]);
                    }}
                ><BootstrapIcon style={TableTheme.tableRowTdIcon} name="pencil-fill" size={2} /></td>);
            keys.forEach((key) => {
                if (typeof (item[key]) === "boolean")
                    row.push(<td style={TableTheme.tableRowTd}><Checkbox readonly={true} checked={item[key]} /></td>);
                else
                    row.push(<td style={TableTheme.tableRowTd}>{item[key]}</td>);
            });
            rows.push(<tr key={index}>{row}</tr>);
        });

        let buttons: React.ReactNode[] = [];
        if (this.props.addUrl)
            buttons.push(<Button label="Add" onClick={() => {
                window.location.assign(this.props.addUrl);
            }} />);

        return (
            <div>
                <table style={TableTheme.table}>
                    <thead>
                        {headers}
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
                <div>{buttons}</div>

            </div>
        );
    }
}
