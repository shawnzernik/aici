/**
 * A class that provides a method for generating UUIDs version 4.
 */
export class UUIDv4 {
    /**
     * Generates a random UUID version 4.
     * @returns A string representing a randomly generated UUID.
     */
    public static generate(): string {
        const randomBytes = new Uint8Array(16);
        crypto.getRandomValues(randomBytes);

        randomBytes[6] = (randomBytes[6] & 0x0f) | 0x40;
        randomBytes[8] = (randomBytes[8] & 0x3f) | 0x80;

        const uuid = Array.from(randomBytes).map((byte, index) => {
            const hex = byte.toString(16).padStart(2, "0");
            if (index === 4 || index === 6 || index === 8 || index === 10)
                return "-" + hex;

            return hex;
        }).join("");

        return uuid;
    }
}
