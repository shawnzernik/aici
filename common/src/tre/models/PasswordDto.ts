export interface PasswordDto {
    guid: string;
    usersGuid: string;
    created: Date;
    salt: string;
    hash: string;
    iterations: number;
}