import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const KEY = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');

if (!KEY || KEY.length !== 32) {
  throw new Error('ENCRYPTION_KEY must be 32 bytes, got ' + KEY?.length);
}

export function encryptPassword(text: string): { encrypted: string; iv: string; tag: string } {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, Buffer.from(KEY!), iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return {
    encrypted,
    iv: iv.toString('hex'),
    tag: cipher.getAuthTag().toString('hex')
  };
}

export function decryptPassword(encrypted: string, iv: string, tag: string): string {
  const decipher = createDecipheriv(
    ALGORITHM, 
    Buffer.from(KEY!),
    Buffer.from(iv, 'hex')
  );
  
  decipher.setAuthTag(Buffer.from(tag, 'hex'));
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}