import { CSSProperties } from "react";
import { Theme } from "./Theme";

/**
 * A class that defines the theme and navigation-related styles for the application.
 */
export class NavigationTheme {
    /** 
     * The name of the application icon. 
     */
    public static applicationIconName = "layout-text-window-reverse";
    /** 
     * Indicates whether the navigation is in debug mode. 
     */
    public static debugStage = false;
    /** 
     * The width of the menu in ems. 
     */
    public static menuWidthEm = 18;
    /** 
     * The size of the top icon in ems. 
     */
    public static topIconSizeEm = 2;

    /** 
     * Styles for the main navigation stage. 
     */
    public static stage: CSSProperties = {
        border: this.debugStage ? "1px solid yellow" : undefined,
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh)",
        zIndex: "0"
    };
    /** 
     * Styles for the top part of the navigation stage. 
     */
    public static stageTop: CSSProperties = {
        border: this.debugStage ? "1px solid black" : undefined,
        display: "flex",
        flexDirection: "row",
        flexGrow: 0,
        flexShrink: 0,
        gap: "4em",
        alignItems: "center",
        width: "100%",
        padding: "1em",
        backgroundColor: Theme.darkPrimary
    };
    /** 
     * Styles for the menu in the top navigation stage. 
     */
    public static stageTopMenu: CSSProperties = {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        border: this.debugStage ? "1px solid black" : undefined,
        height: "fit-content",
        color: Theme.lightNeutral,
        cursor: "pointer"
    };
    /** 
     * Styles for the icons in the top menu. 
     */
    public static stageTopMenuIcon: CSSProperties = {
        border: this.debugStage ? "1px solid black" : undefined,
        color: Theme.lightText
    };
    /** 
     * Styles for the middle part of the navigation stage. 
     */
    public static stageMiddle: CSSProperties = {
        border: this.debugStage ? "1px solid black" : undefined,
        display: "flex",
        flexDirection: "row",
        flexGrow: 1,
        flexShrink: 1,
        width: "100%",
        height: "calc(100vh - 4em - 4em)"
    };
    /** 
     * Styles for the menu in the middle navigation stage. 
     */
    public static stageMiddleMenu: CSSProperties = {
        display: "flex",
        flexDirection: "column",
        flexGrow: 0,
        flexShrink: 0,
        gap: "1em",
        border: this.debugStage ? "1px solid black" : undefined,
        width: this.menuWidthEm + "em",
        padding: "1em",
        backgroundColor: Theme.mediumNeutral,
        borderRight: "2pt solid " + Theme.darkPrimary
    };
    /** 
     * Styles for the items in the middle menu. 
     */
    public static stageMiddleMenuItem: CSSProperties = {
        border: this.debugStage ? "1px solid black" : undefined,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        color: Theme.darkText,
        cursor: "pointer"
    };
    /** 
     * Styles for the content area in the middle navigation stage. 
     */
    public static stageMiddleContent: CSSProperties = {
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        flexShrink: 1,
        gap: "1em",
        border: this.debugStage ? "1px solid black" : undefined,
        padding: "1em",
        overflow: "auto"
    };
    /** 
     * Styles for the bottom part of the navigation stage. 
     */
    public static stageBottom: CSSProperties = {
        border: this.debugStage ? "1px solid black" : undefined,
        display: "flex",
        flexDirection: "row",
        flexGrow: 0,
        flexShrink: 0,
        justifyContent: "space-between",
        width: "100%",
        padding: "1em",
        backgroundColor: Theme.darkPrimary
    };
    /** 
     * Styles for the items in the bottom navigation stage. 
     */
    public static stageBottomItem: CSSProperties = {
        border: this.debugStage ? "1px solid black" : undefined,
        color: Theme.mediumNeutral
    };

    /** 
     * Styles for the fade overlay. 
     */
    public static fade: CSSProperties = {
        zIndex: "10",
        width: "100vw",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        backgroundColor: "#000000aa",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    };
    /** 
     * Styles for the message box in the fade overlay. 
     */
    public static fadeMessage: CSSProperties = {
        backgroundColor: Theme.lightNeutral,
        padding: "1em",
        border: "0.01em solid" + Theme.darkNeutral,
        boxShadow: "0.5em 0.5em 0.5em #000",
        borderRadius: "1em",
        width: "fit-contents",
        maxWidth: "75%"
    };
    /** 
     * Styles for the title of the message in the fade overlay. 
     */
    public static fadeMessageTitle: CSSProperties = {
        fontSize: "2em",
        fontFamily: Theme.HeadingFont,
        color: Theme.darkText
    }
    /** 
     * Styles for the content of the message in the fade overlay. 
     */
    public static fadeMessageContent: CSSProperties = {
        fontFamily: Theme.BodyFont,
        paddingTop: "1em",
        paddingBottom: "1em"
    }
    /** 
     * Styles for the buttons in the fade overlay. 
     */
    public static fadeMessageButtons: CSSProperties = {}
};
