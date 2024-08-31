import { Message } from "./Message";

export interface Lesson {
    guid: string;
    title: string;
    messages: Message[];
}