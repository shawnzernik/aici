export interface MessageButton {
    onClicked?: () => void;
    label: string;
}

export interface Message {
    title: string;
    content: React.ReactNode;
    buttons: MessageButton[];
}