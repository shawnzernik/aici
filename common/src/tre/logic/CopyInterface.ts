export interface CopyInterface<T> {
    copyFrom(source: T): void;

    copyTo(dest: T): void;
}