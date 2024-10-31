import { GroupDto } from "../models/GroupDto";

/**
 * Class to handle the business logic for groups.
 */
export class GroupLogic {
    /**
     * Compares two GroupDto objects by their display names.
     * @param a - The first GroupDto object.
     * @param b - The second GroupDto object.
     * @returns A negative number if a < b, a positive number if a > b, and zero if a == b.
     */
    public static compareDisplayName(a: GroupDto, b: GroupDto): number {
        if (a.displayName < b.displayName)
            return -1;
        if (a.displayName > b.displayName)
            return 1;
        return 0;
    }
}
