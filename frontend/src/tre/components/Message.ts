/**
 * Interface representing a button in a message.
 */
export interface MessageButton {
    /** 
     * Optional callback function that is triggered when the button is clicked. 
     */
    onClicked?: () => void;

    /** 
     * The label of the button. 
     */
    label: string;
}

/**
 * Interface representing a message.
 */
export interface Message {
    /** 
     * The title of the message. 
     */
    title: string;

    /** 
     * The content of the message, can be any React node. 
     */
    content: React.ReactNode;

    /** 
     * An array of buttons associated with the message. 
     */
    buttons: MessageButton[];
}
