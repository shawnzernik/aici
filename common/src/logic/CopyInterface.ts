/**
 * Interface that defines copy functionality between two objects of type T.
 * @template T - The type of the objects that will be copied.
 */
export interface CopyInterface<T> {
    /**
     * Copies data from the source object to the current object.
     * @param source - The object to copy data from.
     */
    copyFrom(source: T): void;

    /**
     * Copies data from the current object to the destination object.
     * @param dest - The object to copy data to.
     */
    copyTo(dest: T): void;
}
