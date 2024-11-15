export interface LogDto {
    guid: string;
    order?: number;
    corelation: string;
    epoch: string;
    level: string;
    caller: string;
    message?: string;
}