import { GroupDto } from "../models/GroupDto";

export class GroupLogic {
    public static compareDisplayName(a: GroupDto, b: GroupDto): number {
        if (a.displayName < b.displayName)
            return -1;
        if (a.displayName > b.displayName)
            return 1;
        return 0;
    }
}