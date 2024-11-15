import { MenuDto } from "../models/MenuDto";

export class MenuLogic {
    public static compareDisplay(a: MenuDto, b: MenuDto): number {
        if (a.display < b.display)
            return -1;
        if (a.display > b.display)
            return 1;
        return 0;
    }
}
