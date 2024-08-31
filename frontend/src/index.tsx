import React, { Component } from "react";
import ReactDOM from "react-dom/client";
import { Theme } from "./Theme";
import { Icon } from "./components/Icon";
import { Tab } from "./components/Tab";
import { ChatPage } from "./pages/ChatPage";
import { WebAppService } from "./services/WebAppService";
import { Alert } from "./models/Alert";
import { Dictionary } from "./models/Dictionary";
import { ConfigurationPage } from "./pages/ConfigurationPage";
import { DatasetsPage } from "./pages/DatasetsPage";
import { LicensePage } from "./pages/LicensePage";
import { DatasetPage } from "./pages/DatasetPage";
import { ConfigurationService } from "./services/ConfigurationService";

interface Props { }
interface State {
    active: string;
    cpu: number;
    memory: number;
    alerts: Alert[];
    loading: boolean;
    shared: Dictionary<string>;
}

class App extends Component<Props, State> {
    private pages: Dictionary<React.ReactElement> = {};
    public constructor(props: Props) {
        super(props);

        this.state = {
            active: "LicensePage",
            cpu: NaN,
            memory: NaN,
            alerts: [{
                title: "Warning",
                message: "This is a private system that does not implement security.  Please ensure that all public access to this system is disabled!  Implement the proper firewall rules."
            }],
            loading: false,
            shared: {}
        };
    }

    public componentDidMount(): void {
        //setInterval(this.updateTimer.bind(this), 1000);

        this.loading(true);

        ConfigurationService.load()
            .then((config) => {
                const newShared: Dictionary<string> = JSON.parse(JSON.stringify(this.state.shared))
                newShared["model"] = config.model;
                this.setShared(newShared, () => {
                    this.loading(false);
                });
            })
            .catch((err: Error) => {
                this.alert({ title: "Error", message: err.message });
            });
    }

    private timerRequests = 0;
    private updateTimer() {
        if (this.timerRequests > 0)
            return;

        this.timerRequests++;

        WebAppService.list()
            .then((stats) => {
                this.timerRequests--;
                this.setState({ cpu: stats.cpu, memory: stats.memory });
            })
            .catch((err: Error) => {
                this.timerRequests--;
                this.setState({ cpu: Number.NaN, memory: Number.NaN }, () => {
                    this.alert({ title: "Error", message: err.message });
                });
            });
    }

    private licenseClicked(): void {
        this.setState({ active: "LicensePage" });
    }
    private trainingClicked(): void {
        this.setState({ active: "ConfigurationPage" });
    }
    private datasetClicked(): void {
        this.setState({ active: "DatasetsPage" });
    }
    private chatsClicked(): void {
        this.setState({ active: "ChatPage" });
    }

    private alert(msg: Alert) {
        const alerts: Alert[] = JSON.parse(JSON.stringify(this.state.alerts));
        alerts.push(msg);
        this.setState({
            alerts: alerts
        });
    }
    private removeAlert() {
        const alerts: Alert[] = JSON.parse(JSON.stringify(this.state.alerts));
        alerts.reverse();
        alerts.pop();
        alerts.reverse();
        this.setState({
            alerts: alerts
        });
    }
    private loading(show: boolean) {
        this.setState({
            loading: show
        });
    }
    private setSharedAndActive(dic: Dictionary<string>, active: string) {
        this.setState({ shared: dic, active: active })
    }
    private setShared(dic: Dictionary<string>, callback: (() => void) | undefined = undefined) {
        this.setState({
            shared: dic
        }, callback);
    }
    private setActive(name: string) {
        this.setState({ active: name });
    }

    public render(): React.ReactElement {
        this.pages = {};
        this.pages["LicensePage"] = <LicensePage
            alert={this.alert.bind(this)}
            loading={this.loading.bind(this)}
            shared={this.state.shared}
            setShared={this.setShared.bind(this)}
        />;
        this.pages["ChatPage"] = <ChatPage
            alert={this.alert.bind(this)}
            loading={this.loading.bind(this)}
            shared={this.state.shared}
            setShared={this.setShared.bind(this)}
        />;
        this.pages["DatasetsPage"] = <DatasetsPage
            alert={this.alert.bind(this)}
            loading={this.loading.bind(this)}
            shared={this.state.shared}
            setSharedAndActive={this.setSharedAndActive.bind(this)}
        />;
        this.pages["ConfigurationPage"] = <ConfigurationPage
            alert={this.alert.bind(this)}
            loading={this.loading.bind(this)}
            shared={this.state.shared}
            setShared={this.setShared.bind(this)}
        />;
        this.pages["DatasetPage"] = <DatasetPage
            alert={this.alert.bind(this)}
            loading={this.loading.bind(this)}
            shared={this.state.shared}
            setShared={this.setShared.bind(this)}
            setActive={this.setActive.bind(this)}
        />;

        let popup = <></>;
        if (this.state.loading)
            popup = <div style={Theme.Dimmed}>
                <div style={Theme.DimmedPopup}>
                    <h3 style={{ margin: 0 }}>Loading...</h3>
                </div>
            </div>;
        if (this.state.alerts && this.state.alerts.length > 0)
            popup = <div style={Theme.Dimmed}>
                <div style={Theme.DimmedPopup}>
                    <h1>{this.state.alerts[0].title}</h1>
                    <p>{this.state.alerts[0].message}</p>
                    <div style={Theme.DimmedPopupButtons}>
                        <button
                            style={{ ...Theme.Button, margin: 0 }}
                            onClick={this.removeAlert.bind(this)}
                        >Close</button>
                    </div>
                </div>
            </div>;

        return (<>
            <div style={Theme.Root}>
                <div style={Theme.RootMenu}>
                    <Icon img="fire" style={Theme.RootMenuIcon} label="Aici" />
                    <Tab label="License" name="LicensePage" active={this.state.active} onClick={this.licenseClicked.bind(this)} />
                    <Tab label="Configuration" name="ConfigurationPage" active={this.state.active} onClick={this.trainingClicked.bind(this)} />
                    <Tab label="Datasets" name="DatasetsPage" active={this.state.active} onClick={this.datasetClicked.bind(this)} />
                    <Tab label="Chat" name="ChatPage" active={this.state.active} onClick={this.chatsClicked.bind(this)} />
                </div>
                <div style={Theme.RootBody}>
                    {this.pages[this.state.active]}
                </div>
                <div style={Theme.RootFooter}>
                    <div style={Theme.RootFooterDiv}>&copy; Copyright Shawn Zenrik 2024</div>
                    <div style={Theme.RootFooterDiv}>CPU: {this.state.cpu} % ; Memory: {this.state.memory} %
                    </div>
                    <div style={Theme.RootFooterDiv}>{this.state.shared["model"]}</div>
                </div>
            </div>
            {popup}
        </>);
    }
}

const rootElement = document.getElementById("root");
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);
}