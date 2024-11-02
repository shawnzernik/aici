import * as React from "react";
import { NavigationMessageEvents, NavigationMessageState } from "../../tre/components/Navigation";
import { Message } from "../../tre/components/Message";

/**
 * Interface representing the state of the BasePage component.
 * Extends the NavigationMessageState to include loading and message properties.
 */
export interface BasePageState extends NavigationMessageState {
    loading: boolean;  // Indicates if the page is loading.
    message: Message | null;  // Holds the message to be displayed, if any.
}

/**
 * Base class for pages, providing navigation and messaging functionalities.
 * 
 * @template P - Props type.
 * @template S - State type, must extend BasePageState.
 */
export class BasePage<P, S extends BasePageState> extends React.Component<P, S> {
    /**
     * Creates an instance of BasePage.
     * 
     * @param props - The props passed to the component.
     */
    public constructor(props: P) {
        super(props);
    }

    /**
     * Creates a deep copy of an object using JSON serialization.
     * 
     * @param model - The model to be copied.
     * @returns A deep copy of the provided model.
     */
    public static jsonCopy<T>(model: T): T {
        return JSON.parse(JSON.stringify(model)) as T;
    }

    /**
     * Creates a deep copy of an object using JSON serialization.
     * 
     * @param model - The model to be copied.
     * @returns A deep copy of the provided model.
     */
    public jsonCopy<T>(model: T): T {
        return BasePage.jsonCopy(model);
    }

    /**
     * Updates the component's state.
     * 
     * @param state - The new state to set, can be a partial state object or the entire state.
     * @returns A promise that resolves when the state update is complete.
     */
    protected async updateState<K extends keyof S>(state: Pick<S, K> | S | null): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.setState(state, () => {
                resolve();
            });
        });
    }

    /**
     * Retrieves a query string parameter from the current URL.
     * 
     * @param key - The name of the query string parameter to retrieve.
     * @returns The value of the query string parameter, or null if not found.
     */
    protected queryString(key: string): string {
        const url = new URL(window.location.href);
        const value = url.searchParams.get(key);
        return value;
    }

    /** 
     * Default state object used to initialize states in derived classes.
     */
    protected static defaultState: BasePageState = {
        loading: false,
        message: null
    }

    /** 
     * Events related to navigation and messaging.
     */
    public events: NavigationMessageEvents = {
        /**
         * Sets the loading state.
         * 
         * @param value - True to set loading, false to unset.
         * @returns A promise that resolves when the state update is complete.
         */
        setLoading: (value) => {
            return new Promise<void>((resolve, reject) => {
                this.setState({ loading: value }, () => { resolve(); })
            });
        },
        /**
         * Sets the message to be displayed.
         * 
         * @param value - The message to set.
         * @returns A promise that resolves when the state update is complete.
         */
        setMessage: (value) => {
            return new Promise<void>((resolve, reject) => {
                this.setState({ message: value }, () => { resolve(); })
            });
        }
    }
}
