import * as React from "react";
import { createRoot } from "react-dom/client";
import { Navigation } from "../../tre/components/Navigation";
import { BasePage, BasePageState } from "../../tre/components/BasePage";
import { Markdown } from "../../tre/components/Markdown";

interface Props { }
interface State extends BasePageState { }

/**
 * Help Page Component
 * Extends BasePage to inherit shared functionality and state management
 */
class Page extends BasePage<Props, State> {
    /**
     * Render method
     * Constructs the JSX to be returned for the component
     * @returns JSX element representing the Help page
     */
    public render(): React.ReactNode {
        return (
            <Navigation
                state={this.state} events={this.events}
                topMenuGuid="b9aeb1c2-4f07-4e91-bbef-25ed565b6ab3"
                leftMenuGuid="4fa7b2ae-953d-45ed-bc83-2194176b0c59"
            >
                <Markdown page={this}>{`
# Help

The following help file can be modified.  This document is intended to provide end users documentation on system use.

## User Access

To gain access to this system, please contact the system administrator to create an account.

## Menus

The system provides two levels of navigation: the top menu, and children menu items on the left.  If you click the application icon/name in the top left, it will show or hide the menu.

`}
                </Markdown>
            </Navigation>
        );
    }
}

/**
 * Window onload event
 * Initializes the React application by rendering the Help Page component
 */
window.onload = () => {
    const element = document.getElementById('root');
    const root = createRoot(element);
    root.render(<Page />)
};

/**
 * Window onpageshow event
 * Determines whether to reload the page based on the event's persisted property
 * @param event The event object associated with the onpageshow event
 */
window.onpageshow = (event) => {
    if (event.persisted) {
        window.location.reload();
    }
};
