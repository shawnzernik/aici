import { SettingEntity } from "../data/SettingEntity";

export class SettingLogic {
    private entity: SettingEntity;

    public constructor(entity: SettingEntity) {
        this.entity = entity;
    }

    public integerValue(): number {
        const ret = Number.parseInt(this.entity.value);
        if (!Number.isInteger(ret))
            throw new Error(`The value "${this.entity.value}" for setting "${this.entity.key}" is not an integer!`);
        return ret;
    }

    public booleanValue(): boolean {
        if (!this.entity.value)
            return false;

        const firstChar = this.entity.value.toLowerCase().charAt(0);
        return firstChar === "t" || firstChar === "y" || firstChar === "1";
    }
}