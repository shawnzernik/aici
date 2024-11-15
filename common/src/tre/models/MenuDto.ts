export interface MenuDto {
    guid: string;
    parentsGuid: string | null;
    order: number;
    display: string;
    bootstrapIcon: string;
    url: string;
}