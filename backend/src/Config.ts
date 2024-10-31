import process from "process"
import { Logger, LogLevels } from "./Logger";

/**
 * Configuration class to manage environment variables and application settings.
 */
export class Config {
    /** 
     * Directory where the JavaScript files are located. 
     * Default is "../frontend/scripts".
     */
    public static javascriptDirectory = process.env.JAVASCRIPT_DIR || "../frontend/scripts";

    /** 
     * Directory where the static files are located. 
     * Default is "../frontend/static".
     */
    public static staticDirectory = process.env.STATIC_DIR || "../frontend/static";

    /** 
     * HTTPS port on which the server will run. 
     * Default is 4433.
     */
    public static httpsPort = Number.parseInt(process.env.HTTPS_PORT || "4433");

    /** 
     * Path to the HTTPS certificate file. 
     * Default is "./server.cert".
     */
    public static httpsCertPath = process.env.HTTPS_CERT_PATH || "./server.cert"

    /** 
     * Path to the HTTPS key file. 
     * Default is "./server.key".
     */
    public static httpsKeyPath = process.env.HTTPS_CERT_KEY || "./server.key"

    /** 
     * Database host to connect to. 
     * Default is "localhost".
     */
    public static dbHost = process.env.DB_HOST || "localhost";

    /** 
     * Database port to connect to. 
     * Default is 5432.
     */
    public static dbPort = Number.parseInt(process.env.DB_PORT || "5432");

    /** 
     * Name of the database to use. 
     * Default is "ts-react-express".
     */
    public static dbName = process.env.DB_NAME || "ts-react-express";

    /** 
     * Database username to connect with. 
     * Default is "postgres".
     */
    public static dbUsername = process.env.DB_USERNAME || "postgres";

    /** 
     * Database password to connect with. 
     * Default is "postgres".
     */
    public static dbPassword = process.env.DB_PASSWORD || "postgres";

    /** 
     * Path to the JWT public key file. 
     * Default is "./public.key".
     */
    public static jwtPublicKeyFile = process.env.JWT_PUBLIC_KEY_FILE || "./public.key"

    /** 
     * Path to the JWT private key file. 
     * Default is "./private.key".
     */
    public static jwtPrivateKeyFile = process.env.JWT_PUBLIC_KEY_FILE || "./private.key"

    /** 
     * Timeout for Jest tests in seconds. 
     * Default is 300 seconds.
     */
    public static jestTimeoutSeconds = Number.parseInt(process.env.JEST_TIMEOUT_SECONDS || "300");

    /** 
     * Limit for HTTPS requests. 
     * Default is "1024mb".
     */
    public static httpsLimit: string = process.env.HTTPS_LIMIT || "1024mb";

    /** 
     * Temporary directory for the application. 
     * Default is "../temp".
     */
    public static tempDirectory: string = process.env.TEMP_DIRECTORY || "../temp";

    /** 
     * Log level for the application. 
     * Default is "trace".
     */
    public static logLevel: LogLevels = process.env.LOG_LEVEL as LogLevels || "trace";

    /** 
     * Indentation level for logs. 
     * Default is "0".
     */
    public static logIndent: number = Number.parseInt(process.env.DB_PORT || "0");

    /** 
     * Embedding model to be used. 
     * Default is "text-embedding-3-small".
     */
    public static embeddingModel: string = process.env.EMBEDDING_MODEL || "text-embedding-3-small";

    /** 
     * Number of bytes per token in embeddings. 
     * Default is 3.
     */
    public static embeddingBytesPerToken: number = Number.parseInt(process.env.EMBEDDING_BYTES_PER_TOKEN || "3");

    /** 
     * Maximum tokens for embeddings. 
     * Default is 8192.
     */
    public static embeddingMaxTokens: number = Number.parseInt(process.env.EMBEDDING_MAX_TOKENS || "8192");

    /** 
     * URL of the Qdrant instance. 
     * Default is "http://localhost:6333".
     */
    public static qdrantUrl: string = process.env.QDRANT_URL || "http://localhost:6333";

    /** 
     * Name of the collection for Qdrant file content. 
     * Default is "name".
     */
    public static qdrantNameCollection: string = process.env.QDRANT_FILE_CONTENT_COLLECTION || "name";

    /** 
     * Name of the collection for Qdrant content. 
     * Default is "content".
     */
    public static qdrantContentCollection: string = process.env.QDRANT_FILE_CONTENT_COLLECTION || "content";

    /** 
     * Name of the collection for Qdrant explanation. 
     * Default is "explanation".
     */
    public static qdrantExplanationCollection: string = process.env.QDRANT_FILE_EXPLANATION_COLLECTION || "explanation";

    /** 
     * Vector size for Qdrant. 
     * Default is 1536.
     */
    public static qdrantVectorSize: number = Number.parseInt(process.env.QDRANT_VECTOR_SIZE || "1536");
}
