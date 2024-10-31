/**
 * DatasetDto interface represents a data transfer object for datasets.
 */
export interface DatasetDto {
    /** 
     * guid is a unique identifier for the dataset. 
     */
    guid: string;

    /** 
     * isUploaded indicates whether the dataset has been uploaded. 
     */
    isUploaded: boolean;

    /** 
     * includeInTraining indicates whether the dataset should be included in training. 
     */
    includeInTraining: boolean;

    /** 
     * title is the name of the dataset. 
     */
    title: string;

    /** 
     * json contains the dataset in JSON format. 
     */
    json: string;
}
