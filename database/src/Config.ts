export class Config {
    public static dbHost = Config.setString(process.env.DB_HOST, "localhost");
    public static dbName = Config.setString(process.env.DB_NAME, "aici");
    public static dbPassword = Config.setString(process.env.DB_PASSWORD, "postgres");
    public static dbPort = Config.setInt(process.env.DB_PORT, "5432");
    public static dbUsername = Config.setString(process.env.DB_USERNAME, "postgres");

    // DO NOT CHANGE THESE FUNCTIONS
    private static setInt(env: string | undefined, dev: string): number {
        return env ? Number.parseInt(env) : Number.parseInt(dev);
    }
    private static setString(env: string | undefined, dev: string): string {
        return env || dev;
    }
    private static setFloat(env: string | undefined, dev: string): number {
        return env ? Number.parseFloat(env) : Number.parseFloat(dev);
    }
}