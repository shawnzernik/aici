import React from "react";
import { Alert } from "../models/Alert";
import { Dictionary } from "../models/Dictionary";
import { Theme } from "../Theme";

interface Props {
    alert: (alert: Alert) => void;
    loading: (show: boolean) => void;
    shared: Dictionary<string>;
    setShared: (dic: Dictionary<string>) => void;

}

export function LicensePage(props: Props): React.ReactElement {
    return <>
        <div style={Theme.License}>
            <h1>Aici</h1>
            <h6>Artificial Intelligence Continuous Improvement</h6>
            This application spawns from the aspiration to custom train good performing AI models.  This strived to be a framework to train an AI model with an easy to use UI.  Areas of consideration is in chat logging and importing those logs into datasets.

            <h2>Copyright</h2>
            &copy; Copyright Shawn Zernik 2024

            <h2>License</h2>
            <p>This program is free software: you can redistribute it and/or modify
                it under the terms of the GNU Affero General Public License as
                published by the Free Software Foundation, either version 3 of the
                License, or (at your option) any later version.</p>

            <p>This program is distributed in the hope that it will be useful,
                but WITHOUT ANY WARRANTY; without even the implied warranty of
                MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
                GNU Affero General Public License for more details.</p>

            <p>You should have received a copy of the GNU Affero General Public License
                along with this program.  If not, see &lt;https://www.gnu.org/licenses/&gt;</p>
        </div>
    </>;
}