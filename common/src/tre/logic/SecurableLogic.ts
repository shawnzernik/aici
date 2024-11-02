import { SecurableDto } from "../models/SecurableDto";

/**
 * Class responsible for logic related to Securable entities.
 */
export class SecurableLogic {
    /**
     * Compares the display names of two SecurableDto objects.
     * @param a - The first SecurableDto object.
     * @param b - The second SecurableDto object.
     * @returns A negative number if a.displayName is less than b.displayName,
     *          a positive number if a.displayName is greater than b.displayName,
     *          and zero if they are equal.
     */
    public static compareDisplayName(a: SecurableDto, b: SecurableDto): number {
        if (a.displayName < b.displayName)
            return -1;
        if (a.displayName > b.displayName)
            return 1;
        return 0;
    }
}
