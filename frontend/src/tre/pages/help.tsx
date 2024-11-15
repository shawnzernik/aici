import * as React from "react";
import { createRoot } from "react-dom/client";
import { Navigation } from "../../tre/components/Navigation";
import { BasePage, BasePageState } from "../../tre/components/BasePage";
import { Markdown } from "../../tre/components/Markdown";

interface Props { }
interface State extends BasePageState { }

class Page extends BasePage<Props, State> {
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

window.onload = () => {
    const element = document.getElementById("root");
    const root = createRoot(element);
    root.render(<Page />)
};

window.onpageshow = (event) => {
    if (event.persisted) {
        window.location.reload();
    }
};
