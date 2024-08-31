import { Lesson } from "./Lesson";

export interface Dataset {
    guid: string;
    title: string;
    lessons: Lesson[];
}