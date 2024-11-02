import { PasswordDto } from "../models/PasswordDto";

export class PasswordLogic {
    /** Setting key for password iterations */
    protected static ITERATIONS_SETTING = "Password:Iterations";
    /** Setting key for minimum password length */
    protected static MINIMUM_LENGTH_SETTING = "Password:Minimum Length";
    /** Setting key for requiring uppercase letters */
    protected static REQUIRE_UPPERCASE_SETTING = "Password:Require Uppercase";
    /** Setting key for requiring lowercase letters */
    protected static REQUIRE_LOWERCASE_SETTING = "Password:Require Lowercase";
    /** Setting key for requiring numbers */
    protected static REQUIRE_NUMBER_SETTING = "Password:Require Numbers";
    /** Setting key for requiring symbols */
    protected static REQUIRE_SYMBOLS_SETTING = "Password:Require Symbols";

    /**
     * Compares two PasswordDto objects by their created date.
     * @param a - The first PasswordDto object.
     * @param b - The second PasswordDto object.
     * @returns A number indicating the relative order of the objects:
     *          negative if a is earlier than b,
     *          positive if a is later than b,
     *          zero if they are equal.
     */
    public static compareCreated(a: PasswordDto, b: PasswordDto): number {
        if (a.created.getTime() < b.created.getTime())
            return -1;
        if (a.created.getTime() > b.created.getTime())
            return 1;
        return 0;
    }

    /**
     * Compares two PasswordDto objects by their created date in descending order.
     * @param a - The first PasswordDto object.
     * @param b - The second PasswordDto object.
     * @returns A number indicating the relative order of the objects:
     *          negative if a is earlier than b,
     *          positive if a is later than b,
     *          zero if they are equal.
     */
    public static compareCreatedDesc(a: PasswordDto, b: PasswordDto): number {
        if (a.created.getTime() < b.created.getTime())
            return 1;
        if (a.created.getTime() > b.created.getTime())
            return -1;
        return 0;
    }
}
