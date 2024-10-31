import { MenuDto } from "../models/MenuDto";

/**
 * A logic class for handling menu-related operations.
 */
export class MenuLogic {
    /**
     * Compares the display order of two MenuDto objects.
     * @param a - The first MenuDto object.
     * @param b - The second MenuDto object.
     * @returns A negative number if a comes before b, a positive number if a comes after b, and zero if they are equal.
     */
    public static compareDisplay(a: MenuDto, b: MenuDto): number {
        if (a.display < b.display)
            return -1;
        if (a.display > b.display)
            return 1;
        return 0;
    }
}
