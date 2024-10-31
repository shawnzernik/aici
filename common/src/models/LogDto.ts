/**
 * Interface representing a log entry data transfer object.
 */
export interface LogDto {
    /** Unique identifier for the log entry */
    guid: string;
    /** Order of the log entry in the sequence (optional) */
    order?: number;
    /** Corelation identifier for tracking related entries */
    corelation: string;
    /** Epoch time when the event occurred */
    epoch: string;
    /** Level of the log (e.g., info, warn, error) */
    level: string;
    /** Caller of the log entry (e.g., service or component name) */
    caller: string;
    /** Additional message associated with the log entry (optional) */
    message?: string;
}
