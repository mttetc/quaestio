import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const ALGORITHM = "aes-256-gcm";

// Generate a development key if none is provided in environment
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || randomBytes(32).toString("hex");
const KEY = Buffer.from(ENCRYPTION_KEY, "hex");

export interface EncryptedData {
    encryptedData: string;
    iv: string;
    tag: string;
}

export function encryptAccessToken(data: string): EncryptedData {
    const iv = randomBytes(12);
    const cipher = createCipheriv(ALGORITHM, KEY, iv);

    let encrypted = cipher.update(data, "utf8", "hex");
    encrypted += cipher.final("hex");

    const tag = cipher.getAuthTag();

    return {
        encryptedData: encrypted,
        iv: iv.toString("hex"),
        tag: tag.toString("hex"),
    };
}

export function decryptAccessToken(encryptedData: string, iv: string, tag: string): string {
    const decipher = createDecipheriv(ALGORITHM, KEY, Buffer.from(iv, "hex"));
    decipher.setAuthTag(Buffer.from(tag, "hex"));

    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
}
