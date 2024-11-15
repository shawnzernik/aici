import { PasswordDto } from "../models/PasswordDto";

export class PasswordLogic {
    protected static ITERATIONS_SETTING = "Password:Iterations";
    protected static MINIMUM_LENGTH_SETTING = "Password:Minimum Length";
    protected static REQUIRE_UPPERCASE_SETTING = "Password:Require Uppercase";
    protected static REQUIRE_LOWERCASE_SETTING = "Password:Require Lowercase";
    protected static REQUIRE_NUMBER_SETTING = "Password:Require Numbers";
    protected static REQUIRE_SYMBOLS_SETTING = "Password:Require Symbols";

    public static compareCreated(a: PasswordDto, b: PasswordDto): number {
        if (a.created.getTime() < b.created.getTime())
            return -1;
        if (a.created.getTime() > b.created.getTime())
            return 1;
        return 0;
    }

    public static compareCreatedDesc(a: PasswordDto, b: PasswordDto): number {
        if (a.created.getTime() < b.created.getTime())
            return 1;
        if (a.created.getTime() > b.created.getTime())
            return -1;
        return 0;
    }
}
