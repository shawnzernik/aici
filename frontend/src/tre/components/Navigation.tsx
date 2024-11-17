import * as React from "react";
import { Dictionary } from "common/src/tre/Dictionary";
import { MenuDto } from "common/src/tre/models/MenuDto";
import { NavigationTheme } from "./NavigationTheme";
import { BootstrapIcon } from "./BootstrapIcon";
import { Button } from "./Button";
import { Message, MessageButton } from "./Message";
import { Theme } from "./Theme";
import { AuthService } from "../services/AuthService";
import { MenuService } from "../services/MenuService";
import { AuthLogic } from "../logic/AuthLogic";
import { SecurableDto } from "common/src/tre/models/SecurableDto";
import { BasePage, BasePageState } from "./BasePage";


export interface NavigationMessageEvents {
    setLoading: (value: boolean) => Promise<void>;
    setMessage: (value: Message) => Promise<void>;
}


export interface NavigationMessageState {
    loading: boolean;
    message?: Message;
}


export function ErrorMessage<P, S extends BasePageState>(page: BasePage<P, S>, err: any): Promise<string | void> {
    const msg = typeof (err) === "string" ? err : err instanceof Error ? err.message : `${err}`;
    return Dialogue<P, S>(page, "Error", msg, ["OK"]);
}


export function Dialogue<P, S extends BasePageState>(page: BasePage<P, S>, title: string, msg: string, buttons?: string[]): Promise<string | void> {
    let buttonsToUse = ["OK"];
    if (buttons)
        buttonsToUse = buttons;

    return new Promise((resolve, reject) => {
        const buttonObjs: MessageButton[] = [];
        buttonsToUse.forEach((label: string) => {
            buttonObjs.push({ label: label, onClicked: () => { resolve(label); } })
        });

        page.events.setMessage({
            title: title,
            content: msg,
            buttons: buttonObjs
        });
    });
}

interface Props {
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    state: NavigationMessageState;
    events: NavigationMessageEvents;
    topMenuGuid: string;
    leftMenuGuid: string;
    showMenu?: boolean;
}

interface State {
    showMenu: boolean;
    activeTopMenuGuid: string;
    activeLeftMenuGuid: string;
}


export class Navigation extends React.Component<Props, State> {
    private rootMenus: MenuDto[] = [];
    private childMenus: Dictionary<MenuDto[]> = {};
    private securables: Dictionary<SecurableDto> = {};
    private auth: AuthLogic;

    public setMenus(top: string, left: string) {
        this.setState({
            activeLeftMenuGuid: left,
            activeTopMenuGuid: top
        });
    }

    public constructor(props: Props) {
        super(props);

        let menu = this.props.showMenu === true;

        this.state = {
            showMenu: menu,
            activeTopMenuGuid: this.props.topMenuGuid,
            activeLeftMenuGuid: this.props.leftMenuGuid,
        };
    }

    public async componentDidMount(): Promise<void> {
        this.props.events.setLoading(true);

        try {
            let token = await AuthService.getToken();
            if (!token) {
                token = await AuthService.anonymous();
                AuthService.setToken(token);
            }

            const key = await AuthService.publicKey();
            this.auth = await AuthLogic.tokenLogin(token, key);

            this.securables = {};
            this.auth.securables.forEach((s) => {
                this.securables[s.guid] = s;
            });

            let menus = await MenuService.list(token);
            menus.forEach((menu) => {
                if (this.securables[menu.guid]) {
                    if (menu.parentsGuid) {
                        if (!this.childMenus[menu.parentsGuid])
                            this.childMenus[menu.parentsGuid] = [];
                        this.childMenus[menu.parentsGuid].push(menu);
                    } else
                        this.rootMenus.push(menu);
                }
            });

            const menuComparer = (a: MenuDto, b: MenuDto): number => {
                return a.order - b.order;
            };
            this.rootMenus.sort(menuComparer);
            Object.keys(this.childMenus).forEach((key) => {
                this.childMenus[key].sort(menuComparer);
            });
        }
        catch (err) {
            await ErrorMessage(this as unknown as BasePage<any, BasePageState>, err);
        }

        this.props.events.setLoading(false);
    }

    public render(): React.ReactNode {
        if (!this.props.state) {
            return;
        }

        let topMenu: React.ReactNode[] = [];
        this.rootMenus.forEach((menu) => {
            let color = Theme.lightText;
            if (menu.guid === this.state.activeTopMenuGuid)
                color = Theme.lightPrimary;

            topMenu.push(
                <div
                    key={menu.guid}
                    style={NavigationTheme.stageTopMenu}
                    onClick={() => {
                        this.setState((prev) => {
                            let showMenu = prev.activeTopMenuGuid !== menu.guid;

                            return {
                                activeTopMenuGuid: menu.guid,
                                showMenu: showMenu || !prev.showMenu
                            }
                        });
                    }}
                >
                    <BootstrapIcon name={menu.bootstrapIcon} size={2} color={color} />
                    &nbsp; {menu.display}
                </div>
            );
        });

        let leftMenuItems: React.ReactNode[] = [];
        if (this.childMenus[this.state.activeTopMenuGuid])
            this.childMenus[this.state.activeTopMenuGuid].forEach((menu) => {
                let iconColor = Theme.darkText;
                if (menu.guid === this.state.activeLeftMenuGuid)
                    iconColor = Theme.lightPrimary;

                leftMenuItems.push(
                    <div
                        key={menu.guid}
                        style={NavigationTheme.stageMiddleMenuItem}
                        onClick={() => {
                            window.location.assign(menu.url);
                        }}
                    >
                        <BootstrapIcon color={iconColor} name={menu.bootstrapIcon} size={2} />
                        &nbsp; {menu.display}
                    </div>
                );
            });

        let leftMenu: React.ReactNode = <></>;
        if (this.state.showMenu)
            leftMenu = <div style={NavigationTheme.stageMiddleMenu}>{leftMenuItems}</div>;

        let loading = undefined;
        if (this.props.state.loading) {
            loading = (
                <div style={NavigationTheme.fade}>
                    <div style={NavigationTheme.fadeMessage}>
                        <div style={NavigationTheme.fadeMessageTitle}>Loading</div>
                    </div>
                </div>
            );
        }

        let message: React.ReactElement | undefined = undefined;
        if (this.props.state.message) {
            let buttons: React.ReactElement[] = []
            this.props.state.message.buttons.forEach((btn) => {
                buttons.push(
                    <Button
                        label={btn.label}
                        onClick={() => {
                            if (btn.onClicked)
                                btn.onClicked();
                            this.props.events.setMessage(null);
                        }}
                    />
                );
            });

            message = (
                <div style={NavigationTheme.fade}>
                    <div style={NavigationTheme.fadeMessage}>
                        <div style={NavigationTheme.fadeMessageTitle}>{this.props.state.message.title}</div>
                        <div style={NavigationTheme.fadeMessageContent}>{this.props.state.message.content}</div>
                        <div style={NavigationTheme.fadeMessageButtons}>{buttons}</div>
                    </div>
                </div>
            );
        }

        return <>
            <div style={NavigationTheme.stage}>
                <div style={NavigationTheme.stageTop}>
                    <div
                        style={{ ...NavigationTheme.stageTopMenu, cursor: "pointer" }}
                        onClick={() => {
                            this.setState((prev) => {
                                return {
                                    showMenu: !prev.showMenu
                                }
                            });
                        }}
                    >
                        <BootstrapIcon style={NavigationTheme.stageTopMenuIcon} name="list" size={2} />
                        &nbsp; Lago Vista Technology
                    </div>
                    {topMenu}
                </div>
                <div style={NavigationTheme.stageMiddle}>
                    {leftMenu}
                    <div style={NavigationTheme.stageMiddleContent}>{this.props.children}</div>
                </div>
                <div style={NavigationTheme.stageBottom}>
                    <div style={NavigationTheme.stageBottomItem}>&copy; Copyright 2024, Shawn Zernik</div>
                    <div style={NavigationTheme.stageBottomItem}>v0.0.0</div>
                    <div style={NavigationTheme.stageBottomItem}>{this.auth && this.auth.user ? this.auth.user.emailAddress : "user not found"}</div>
                </div>
            </div>
            {message ? message : loading ? loading : null}
        </>;
    }
}
