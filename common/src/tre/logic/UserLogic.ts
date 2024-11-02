import { UserDto } from "../models/UserDto";

/**
 * Class responsible for user-related business logic.
 */
export class UserLogic {
    /**
     * Compares two UserDto objects by their email addresses.
     * @param a - The first UserDto object.
     * @param b - The second UserDto object.
     * @returns A negative number if a's email is less than b's, 
     *          a positive number if a's email is greater than b's, 
     *          and zero if they are equal.
     */
    public static compareEmailAddress(a: UserDto, b: UserDto): number {
        if (a.emailAddress < b.emailAddress)
            return -1;
        if (a.emailAddress > b.emailAddress)
            return 1;
        return 0;
    }
}
