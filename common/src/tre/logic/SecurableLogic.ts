import { SecurableDto } from "../models/SecurableDto";

export class SecurableLogic {
    public static compareDisplayName(a: SecurableDto, b: SecurableDto): number {
        if (a.displayName < b.displayName)
            return -1;
        if (a.displayName > b.displayName)
            return 1;
        return 0;
    }
}
