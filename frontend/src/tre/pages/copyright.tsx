import * as React from "react";
import { createRoot } from "react-dom/client";
import { Navigation } from "../../tre/components/Navigation";
import { BasePage, BasePageState } from "../../tre/components/BasePage";
import { Markdown } from "../../tre/components/Markdown";

interface Props { }

/** 
 * State interface that extends BasePageState 
 */
interface State extends BasePageState { }

/**
 * Page class that extends BasePage
 * Represents the copyright page
 */
class Page extends BasePage<Props, State> {
    /** 
     * Render method
     * Renders the Navigation component with the Markdown content
     * @returns React.ReactNode 
     */
    public render(): React.ReactNode {
        return (
            <Navigation
                state={this.state} events={this.events}
                topMenuGuid="b9aeb1c2-4f07-4e91-bbef-25ed565b6ab3"
                leftMenuGuid="5a8a209b-e6c1-42e4-8bc9-f144feec6d8e"
            >
                <Markdown page={this}>{`
# TypeScript React Express

Copyright &copy; 2024 Shawn Zernik

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.                    

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see &lt;https://www.gnu.org/licenses/&gt;.
`}</Markdown>
            </Navigation>
        );
    }
}

/** 
 * Window onload event 
 * Initializes the root element for React rendering 
 */
window.onload = () => {
    const element = document.getElementById('root');
    const root = createRoot(element);
    root.render(<Page />)
};

/** 
 * Window onpageshow event 
 * Reloads the page if it was restored from the cache 
 * @param event The event object 
 */
window.onpageshow = (event) => {
    if (event.persisted) {
        window.location.reload();
    }
};
