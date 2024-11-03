export class Version {
    public breaking = 0;
    public feature = 0;
    public fix = 0;

    public constructor(value: string) {
        if (!value)
            throw new Error(`Version number is not the correct format: ${value}`);

        const parts: string[] = value.split(".");
        if (parts.length != 3)
            throw new Error(`Version number is not the correct format: ${value}`);

        this.breaking = Number.parseInt(parts[0]);
        this.feature = Number.parseInt(parts[1]);
        this.fix = Number.parseInt(parts[2]);
    }

    public toString(): string {
        return `${this.breaking.toString()}.${this.feature.toString()}.${this.fix.toString()}`;
    }

    public static compareStrings(a: string, b: string): number {
        const aVersion = new Version(a);
        const bVersion = new Version(b);
        return Version.compare(aVersion, bVersion);
    }

    public static compare(a: Version, b: Version): number {
        if (
            a.breaking < b.breaking ||
            (a.breaking == b.breaking && a.feature < b.feature) ||
            (a.breaking == b.breaking && a.feature == b.feature && a.fix < b.fix)
        )
            return -1;
        if (
            a.breaking > b.breaking ||
            (a.breaking == b.breaking && a.feature > b.feature) ||
            (a.breaking == b.breaking && a.feature == b.feature && a.fix > b.fix)
        )
            return 1;
        return 0;
    }
}