import { UserDto } from "../models/UserDto";

export class UserLogic {
    public static compareEmailAddress(a: UserDto, b: UserDto): number {
        if (a.emailAddress < b.emailAddress)
            return -1;
        if (a.emailAddress > b.emailAddress)
            return 1;
        return 0;
    }
}
