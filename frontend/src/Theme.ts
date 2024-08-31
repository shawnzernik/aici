import { CSSProperties } from "react";

export class Theme {
    static FontSizePx = 13;
    static DarkBackground = "#f80";
    static MediumBackground = "#fdb";
    static LightBackground = "#fff";

    static DarkBorder = "#000";
    static MediumBorder = "#666";
    static LightBorder = "#fff";

    static LightText = "#fff";
    static Text = "#666";
    static DarkText = "#000";
    static ContrastText = "#36b"
    static LabelWidth = 10 * this.FontSizePx;

    static Root: CSSProperties = {
        width: "100%",
        height: "calc(100vh)",
        backgroundColor: Theme.DarkBackground,
        display: "flex",
        flexDirection: "column",
        zIndex: 0
    };
    static RootMenu: CSSProperties = {
        display: "flex",
        flexDirection: "row",
        height: this.FontSizePx * 4 + "px",
        paddingLeft: this.FontSizePx + "px",
        paddingRight: this.FontSizePx + "px",
    };
    static RootMenuIcon: CSSProperties = {
        fontSize: this.FontSizePx * 2 + "px",
        alignContent: "center",
        paddingRight: this.FontSizePx + "px",
        flexGrow: 1,
        color: this.LightText
    };
    static RootBody: CSSProperties = {
        background: this.LightBackground,
        height: "calc(100vh - " + this.FontSizePx * 8 + "px)",
        overflow: "auto"
    };
    static RootFooter: CSSProperties = {
        display: "flex",
        flexDirection: "row",
        padding: this.FontSizePx + "px",
        height: this.FontSizePx * 4 + "px",
        justifyContent: "space-between",
        alignItems: "center"
    };
    static RootFooterDiv: CSSProperties = {
        color: this.LightText
    }

    static Tab: CSSProperties = {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        paddingLeft: this.FontSizePx + "px",
    };
    static TabLabel: CSSProperties = {
        paddingTop: this.FontSizePx * 0.5 + "px",
        paddingLeft: this.FontSizePx + "px",
        paddingRight: this.FontSizePx + "px",
        paddingBottom: this.FontSizePx * 0.5 + "px",
        flexGrow: 0,
        cursor: "pointer",
        borderTopLeftRadius: this.FontSizePx * 0.25 + "px",
        borderTopRightRadius: this.FontSizePx * 0.25 + "px"
    };
    static TabActive: CSSProperties = {};
    static TabLabelActive: CSSProperties = {
        background: this.LightBackground,
    };

    static Buttons: CSSProperties = {
        display: "flex",
        flexDirection: "row",
        gap: this.FontSizePx + "px",
        width: "100%",
        marginTop: this.FontSizePx + "px",
        justifyContent: "flex-end"
    }
    static Button: CSSProperties = {
        padding: this.FontSizePx + "px",
        border: "1px solid " + this.DarkBorder,
        borderRadius: this.FontSizePx * 0.25 + "px",
    }
    static TextArea: CSSProperties = {
        border: "1px solid " + this.Text,
        color: this.DarkText,
        padding: this.FontSizePx + "px",
        width: "100%",
        borderRadius: this.FontSizePx * 0.25 + "px"
    }
    static Chat: CSSProperties = {
        padding: this.FontSizePx + "px"
    }
    static ChatHistory: CSSProperties | undefined;
    static ChatTextArea: CSSProperties | undefined;
    static ChatButtons: CSSProperties = {
        ...this.Buttons,
        marginTop: 0
    }
    static Form: CSSProperties = {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
    }
    static TrainingButtons: CSSProperties = {
        ...this.Buttons
    }
    static Dimmed: CSSProperties = {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: 0,
        left: 0,
        width: "calc(100vw)",
        height: "calc(100vh)",
        backgroundColor: "#0008",
        zIndex: 10
    }
    static DimmedPopup: CSSProperties = {
        border: "1px solid " + this.DarkBorder,
        borderRadius: this.FontSizePx + "px",
        backgroundColor: this.LightBackground,
        padding: this.FontSizePx * 2 + "px",
        maxWidth: "50%"
    }
    static DimmedPopupButtons: CSSProperties = {
        ...this.Buttons
    }
    static FormFieldSelect: CSSProperties = {
        border: "1px solid " + this.Text,
        color: this.DarkText,
        padding: this.FontSizePx + "px",
        paddingTop: this.FontSizePx * 0.5 + "px",
        paddingBottom: this.FontSizePx * 0.5 + "px",
        width: "100%",
        borderRadius: this.FontSizePx * 0.25 + "px"
    }
    static Config: CSSProperties = {
        padding: this.FontSizePx + "px"
    };
    static License: CSSProperties = {
        padding: this.FontSizePx + "px"
    };
    static Datasets: CSSProperties = {
        display: "flex",
        flexDirection: "column"
    }
    static DatasetNav: CSSProperties = {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        padding: this.FontSizePx + "px",
        height: this.FontSizePx * 4 + "px",
        backgroundColor: this.MediumBackground,
        color: this.DarkText
    }
    static DatasetBody: CSSProperties = {
        display: "flex",
        flexDirection: "row"
    };
    static DatasetBodyLessons: CSSProperties = {
        background: this.ContrastText,
        color: this.LightText,
        padding: this.FontSizePx + "px",
        height: "calc(100vh - " + this.FontSizePx * 12 + "px)",
        overflow: "auto",
        width: this.FontSizePx * 25 + "px"
    };
    static DatasetBodyConversation: CSSProperties = {
        padding: this.FontSizePx + "px",
        width: "100%",
        height: "calc(100vh - " + this.FontSizePx * 12 + "px)",
        overflow: "auto"
    };
    static Code: CSSProperties = {
        fontFamily: "monospace",
        textWrap: "nowrap"
    };
    static FormField(size: number): CSSProperties | undefined {
        return {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            paddingTop: this.FontSizePx * 0.25 + "px",
            paddingBottom: this.FontSizePx * 0.25 + "px",
            width: (this.LabelWidth * 2) * size + "px"
        };
    }
    static FormFieldLabel: CSSProperties = {
        paddingRight: this.FontSizePx * 0.5 + "px",
        textAlign: "right",
        flexGrow: 0,
        flexShrink: 0,
        width: this.LabelWidth + "px",
    }
    static FormFieldInput: CSSProperties = {
        border: "1px solid " + this.Text,
        color: this.DarkText,
        padding: this.FontSizePx + "px",
        paddingTop: this.FontSizePx * 0.5 + "px",
        paddingBottom: this.FontSizePx * 0.5 + "px",
        width: "100%",
        borderRadius: this.FontSizePx * 0.25 + "px"
    }

    static Dataset: CSSProperties = {
        padding: this.FontSizePx + "px",
        display: "flex",
        flexDirection: "column"
    }
    static DatasetButtons: CSSProperties = {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: this.FontSizePx + "px",
        marginTop: this.FontSizePx + "px"
    }
    static DatasetLists: CSSProperties = {
        display: "flex",
        flexDirection: "row"
    }
    static DatasetListChild: CSSProperties = {
        width: "50%"
    }
    static DatasetListChildList: CSSProperties = {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap"
    }
    static DatasetListChildListItem: CSSProperties = {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        padding: this.FontSizePx + "px",
        margin: this.FontSizePx * 0.5 + "px",
        borderRadius: this.FontSizePx * 0.25 + "px",
        border: "1px solid " + this.DarkBorder,
        backgroundColor: this.MediumBackground
    }
    static DatasetListChildListItemEdit: CSSProperties = {
        color: this.LightText
    }
}