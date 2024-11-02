import { LogLevels } from "./tre/Logger";

export class Config {
    public static appName = Config.setString(process.env.APP_NAME, "TS React Express");
    public static appVersion = Config.setString(process.env.APP_VERSION, "0.0.2");
    public static appCopyright = Config.setString(process.env.APP_COPYRIGHT, "© Copyright 2024 Shawn Zernik");
    public static appUrl = Config.setString(process.env.APP_COPYRIGHT, "https://localhost:4434");
    public static dbHost = Config.setString(process.env.DB_HOST, "localhost");
    public static dbName = Config.setString(process.env.DB_NAME, "aici");
    public static dbPassword = Config.setString(process.env.DB_PASSWORD, "postgres");
    public static dbPort = Config.setInt(process.env.DB_PORT, "5432");
    public static dbUsername = Config.setString(process.env.DB_USERNAME, "postgres");
    public static httpsCertPath = Config.setString(process.env.HTTPS_CERT_PATH, "./server.cert");
    public static httpsDefaultPage = Config.setString(process.env.HTTPS_DEFAULT_PAGE, "/static/tre/pages/login.html");
    public static httpsKeyPath = Config.setString(process.env.HTTPS_CERT_KEY, "./server.key");
    public static httpsLimit = Config.setString(process.env.HTTPS_LIMIT, "1024mb");
    public static httpsPort = Config.setInt(process.env.HTTPS_PORT, "4434");
    public static javascriptDirectory = Config.setString(process.env.JAVASCRIPT_DIR, "../frontend/scripts");
    public static jestTimeoutSeconds = Config.setInt(process.env.JEST_TIMEOUT_SECONDS, "300");
    public static jwtPrivateKeyFile = Config.setString(process.env.JWT_PRIVATE_KEY_FILE, "./private.key");
    public static jwtPublicKeyFile = Config.setString(process.env.JWT_PUBLIC_KEY_FILE, "./public.key");
    public static logIndent = Config.setInt(process.env.LOG_INDENT, "0");
    public static logLevel = Config.setString(process.env.LOG_LEVEL, "trace") as LogLevels;
    public static staticDirectory = Config.setString(process.env.STATIC_DIR, "../frontend/static");
    public static tempDirectory = Config.setString(process.env.TEMP_DIRECTORY, "../temp");

    public static embeddingModel = Config.setString(process.env.EMBEDDING_MODEL, "text-embedding-3-small");
    public static embeddingBytesPerToken = Config.setInt(process.env.EMBEDDING_BYTES_PER_TOKEN, "3");
    public static embeddingMaxTokens = Config.setInt(process.env.EMBEDDING_MAX_TOKENS, "8192");
    public static qdrantUrl = Config.setString(process.env.QDRANT_URL, "http://localhost:6333");
    public static qdrantNameCollection = Config.setString(process.env.QDRANT_FILE_NAME_COLLECTION, "name");
    public static qdrantContentCollection = Config.setString(process.env.QDRANT_FILE_CONTENT_COLLECTION, "content");
    public static qdrantExplanationCollection = Config.setString(process.env.QDRANT_FILE_EXPLANATION_COLLECTION, "explanation");
    public static qdrantVectorSize = Config.setInt(process.env.QDRANT_VECTOR_SIZE, "1536");
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
