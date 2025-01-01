import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const AUTH_KEY = Buffer.from(process.env.ENCRYPTION_KEY || '', 'hex');
const EMAIL_KEY = Buffer.from(process.env.EMAIL_ENCRYPTION_KEY || '', 'hex');

if (!process.env.ENCRYPTION_KEY) {
    throw new Error('ENCRYPTION_KEY environment variable is required');
}

if (!process.env.EMAIL_ENCRYPTION_KEY) {
    throw new Error('EMAIL_ENCRYPTION_KEY environment variable is required');
}

// Auth encryption
export function encryptPassword(password: string): string {
    const iv = randomBytes(12);
    const cipher = createCipheriv(ALGORITHM, AUTH_KEY, iv);

    let encrypted = cipher.update(password, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return `${encrypted}|${iv.toString('hex')}:${authTag.toString('hex')}`;
}

export function decryptPassword(encryptedData: string): string {
    const [encrypted, ivAndTag] = encryptedData.split('|');
    const [iv, tag] = ivAndTag.split(':');

    const decipher = createDecipheriv(ALGORITHM, AUTH_KEY, Buffer.from(iv, 'hex'));
    decipher.setAuthTag(Buffer.from(tag, 'hex'));

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

// Email encryption
export interface EncryptedData {
    encryptedData: string;
    iv: string;
}

export function encryptAccessToken(accessToken: string): EncryptedData {
    const iv = randomBytes(16);
    const cipher = createCipheriv(ALGORITHM, EMAIL_KEY, iv);

    let encrypted = cipher.update(accessToken, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return {
        encryptedData: encrypted,
        iv: iv.toString('hex')
    };
}

export function decryptAccessToken(encryptedData: string, iv: string): string {
    const decipher = createDecipheriv(
        ALGORITHM, 
        EMAIL_KEY, 
        Buffer.from(iv, 'hex')
    );

    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
} 