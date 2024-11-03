export interface ManagerVersionDto {
    guid: string;
    version: string;
    occurred: Date;
    success: boolean;
    log: string;
}