import * as React from "react";
import { NavigationMessageEvents, NavigationMessageState } from "../../tre/components/Navigation";
import { Message } from "../../tre/components/Message";

export interface BasePageState extends NavigationMessageState {
    loading: boolean;  
    message: Message | null;  
}

export class BasePage<P, S extends BasePageState> extends React.Component<P, S> {
    public constructor(props: P) {
        super(props);
    }

    public static jsonCopy<T>(model: T): T {
        return JSON.parse(JSON.stringify(model)) as T;
    }

    public jsonCopy<T>(model: T): T {
        return BasePage.jsonCopy(model);
    }

    protected async updateState<K extends keyof S>(state: Pick<S, K> | S | null): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.setState(state, () => {
                resolve();
            });
        });
    }

    protected queryString(key: string): string {
        const url = new URL(window.location.href);
        const value = url.searchParams.get(key);
        return value;
    }

    protected static defaultState: BasePageState = {
        loading: false,
        message: null
    }

    public events: NavigationMessageEvents = {
        setLoading: (value) => {
            return new Promise<void>((resolve, reject) => {
                this.setState({ loading: value }, () => { resolve(); })
            });
        },
        setMessage: (value) => {
            return new Promise<void>((resolve, reject) => {
                this.setState({ message: value }, () => { resolve(); })
            });
        }
    }
}