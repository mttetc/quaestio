import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const ALGORITHM = "aes-256-gcm";
const KEY = Buffer.from(process.env.ENCRYPTION_KEY || "", "hex");

export function encryptPassword(password: string): string {
    const iv = randomBytes(12);
    const cipher = createCipheriv(ALGORITHM, KEY, iv);

    let encrypted = cipher.update(password, "utf8", "hex");
    encrypted += cipher.final("hex");

    const authTag = cipher.getAuthTag();

    return `${encrypted}|${iv.toString("hex")}:${authTag.toString("hex")}`;
}

export function decryptPassword(encryptedData: string): string {
    const [encrypted, ivAndTag] = encryptedData.split("|");
    const [iv, tag] = ivAndTag.split(":");

    const decipher = createDecipheriv(ALGORITHM, KEY, Buffer.from(iv, "hex"));

    decipher.setAuthTag(Buffer.from(tag, "hex"));

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
}
