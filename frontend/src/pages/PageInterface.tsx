import { Alert } from "../models/Alert";
import { Dictionary } from "../models/Dictionary";

interface Props {
    alert: (alert: Alert) => void;
    loading: (show: boolean) => void;
    shared: Dictionary<string>;
    setShared: (dic: Dictionary<string>, callback: (() => void) | undefined) => void;
}

interface State {}

export interface PageInterface<P extends Props, S extends State> extends React.Component<P, S> { }