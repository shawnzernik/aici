import * as React from "react";
import { ListFilterOptions } from "./ListFilterCompareOptions";
import { ListFilterDto } from "common/src/tre/models/ListFilterDto";
import { BasePage } from "../../tre/components/BasePage";
import { Button } from "../../tre/components/Button";
import { Field } from "../../tre/components/Field";
import { FlexRow } from "../../tre/components/FlexRow";
import { Form } from "../../tre/components/Form";
import { Heading } from "../../tre/components/Heading";
import { Input } from "../../tre/components/Input";
import { Select } from "../../tre/components/Select";
import { TextArea } from "../../tre/components/TextArea";
import { Theme } from "../../tre/components/Theme";

interface Props {
    value: ListFilterDto[];
    onChange: (value: ListFilterDto[]) => void;
    onDelete: (value: ListFilterDto) => void;
}

interface State { }

export class ListFilterEditList extends React.Component<Props, State> {
    public constructor(props: Props) {
        super(props);
    }

    private deleteClicked(index: number) {
        for (let cnt = 0; cnt < this.props.value.length; cnt++)
            if (cnt == index)
                this.props.onDelete(this.props.value[cnt]);
    }

    public render(): React.ReactNode {
        const list: React.ReactElement[] = [];

        for (let cnt = 0; cnt < this.props.value.length; cnt++) {
            if (cnt > 0)
                list.push(<div style={{ borderTop: "1pt solid " + Theme.darkNeutral, width: "100%" }}></div>);
            list.push(
                <>
                    <Form>
                        <Field label="GUID" size={3}><Input
                            value={this.props.value[cnt].guid}
                        /></Field>
                        <Field label="Label" size={1}><Input
                            value={this.props.value[cnt].label}
                            onChange={(value) => {
                                const newList = BasePage.jsonCopy(this.props.value);
                                newList[cnt].label = value;
                                this.props.onChange(newList);
                            }}
                        /></Field>
                        <Field label="SQL Column" size={2}><Input
                            value={this.props.value[cnt].sqlColumn}
                            onChange={(value) => {
                                const newList = BasePage.jsonCopy(this.props.value);
                                newList[cnt].sqlColumn = value;
                                this.props.onChange(newList);
                            }}
                        /></Field>
                        <Field label="SQL Type" size={1}><Select
                            value={this.props.value[cnt].sqlType}
                            onChange={(value) => {
                                const newList = BasePage.jsonCopy(this.props.value);
                                newList[cnt].sqlType = value;
                                this.props.onChange(newList);
                            }}
                        >
                            {ListFilterOptions.allTypes()}
                        </Select></Field>
                        <Field label="Options SQL"><TextArea
                            rows={10}
                            value={this.props.value[cnt].optionsSql}
                            onChange={(value) => {
                                const newList = BasePage.jsonCopy(this.props.value);
                                newList[cnt].optionsSql = value;
                                this.props.onChange(newList);
                            }}
                        /></Field>
                        <Field label="Default Compare" size={2}><Select
                            value={this.props.value[cnt].defaultCompare}
                            onChange={(value) => {
                                const newList = BasePage.jsonCopy(this.props.value);
                                newList[cnt].defaultCompare = value;
                                this.props.onChange(newList);
                            }}
                        >
                            {ListFilterOptions.forType(this.props.value[cnt].sqlType)}
                        </Select></Field>
                        <Field label="Default Value" size={2}><Input
                            value={this.props.value[cnt].defaultValue}
                            onChange={(value) => {
                                const newList = BasePage.jsonCopy(this.props.value);
                                newList[cnt].defaultValue = value;
                                this.props.onChange(newList);
                            }}
                        /></Field>
                    </Form>
                    <FlexRow gap="1em">
                        <Button label="Delete Filter" onClick={() => { this.deleteClicked(cnt); }} />
                    </FlexRow>
                </>
            );
        }

        return <>
            <Heading level={2}>List Filters</Heading>
            {list}
        </>;
    }
}
