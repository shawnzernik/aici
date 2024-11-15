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