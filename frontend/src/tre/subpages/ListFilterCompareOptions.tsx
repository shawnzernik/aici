import * as React from "react";
import { SelectOption } from "../../tre/components/SelectOption";

export class ListFilterOptions {
    public static allTypes(): any[] {
        const ret: any[] = [];
        ret.push(<SelectOption display="" value="" />);
        ret.push(<SelectOption display="bigint" value="bigint" />);
        ret.push(<SelectOption display="bigserial" value="bigserial" />);
        ret.push(<SelectOption display="boolean" value="boolean" />);
        ret.push(<SelectOption display="bytea" value="bytea" />);
        ret.push(<SelectOption display="char" value="char" />);
        ret.push(<SelectOption display="date" value="date" />);
        ret.push(<SelectOption display="double" value="double" />);
        ret.push(<SelectOption display="int" value="int" />);
        ret.push(<SelectOption display="interval" value="interval" />);
        ret.push(<SelectOption display="money" value="money" />);
        ret.push(<SelectOption display="numberic" value="numberic" />);
        ret.push(<SelectOption display="real" value="real" />);
        ret.push(<SelectOption display="serial" value="serial" />);
        ret.push(<SelectOption display="smallint" value="smallint" />);
        ret.push(<SelectOption display="text" value="text" />);
        ret.push(<SelectOption display="time" value="time" />);
        ret.push(<SelectOption display="timestamp" value="timestamp" />);
        ret.push(<SelectOption display="varchar" value="varchar" />);
        return ret;
    }

    public static forType(sqlType: string): any[] {
        const ret: any[] = [];
        ret.push(<SelectOption display="" value="" />);
        if (sqlType) {
            ret.push(<SelectOption display="Equals" value="e" />);
            ret.push(<SelectOption display="Not Equal" value="ne" />);
        }
        if (!sqlType || sqlType != "boolean") {
            ret.push(<SelectOption display="Less Than" value="lt" />);
            ret.push(<SelectOption display="Less Then or Equals" value="lte" />);
            ret.push(<SelectOption display="Greater Than" value="gt" />);
            ret.push(<SelectOption display="Greater Than or Equals" value="gte" />);
        }
        if (!sqlType || sqlType == "text" || sqlType.includes("char")) {
            ret.push(<SelectOption display="Contains" value="c" />);
            ret.push(<SelectOption display="Does Not Contain" value="dnc" />);
        }
        if (sqlType) {
            ret.push(<SelectOption display="Null" value="n" />);
            ret.push(<SelectOption display="Not Null" value="nn" />);
        }
        return ret;
    }
}