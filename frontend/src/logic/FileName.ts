export class FileName {
    public static sanitize(name: string): string {
        let ret = name.toLowerCase().trim();
        ret = ret.replace(/\s+/g, "-");
        ret = ret.replace(/--/g, "-");
        ret = ret.replace(/[^a-zA-Z0-9\-]/g, '');
        return ret;
    }
}