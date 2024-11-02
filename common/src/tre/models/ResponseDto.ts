/**
 * A generic response DTO (Data Transfer Object) for API responses.
 *
 * @template T - The type of the data being returned in the response.
 */
export interface ResponseDto<T> {
    /** 
     * The data returned in the response. 
     * This property is optional.
     */
    data?: T;
    /** 
     * An error message, if any occurred during the processing. 
     * This property is optional.
     */
    error?: string;
}
