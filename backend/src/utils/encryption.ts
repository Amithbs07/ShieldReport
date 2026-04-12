import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;

/**
 * Encrypts a string using AES-256-GCM.
 * The output string format is: iv:salt:auth_tag:encrypted_content (all hex encoded)
 */
export const encrypt = (text: string): string => {
  const encryptionKey = process.env.ENCRYPTION_KEY;
  if (!encryptionKey || encryptionKey.length !== 64) {
    throw new Error('ENCRYPTION_KEY must be exactly 64 hex characters (32 bytes)');
  }

  const keyBuffer = Buffer.from(encryptionKey, 'hex');
  const iv = crypto.randomBytes(IV_LENGTH);
  const salt = crypto.randomBytes(SALT_LENGTH);

  // In a real app we might derive a key using pbkdf2 and the salt,
  // but with a strong 32-byte ENCRYPTION_KEY, we can just use the key directly.
  const cipher = crypto.createCipheriv(ALGORITHM, keyBuffer, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return `${iv.toString('hex')}:${salt.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
};

/**
 * Decrypts a string using AES-256-GCM.
 * The input string format is expected to be: iv:salt:auth_tag:encrypted_content
 */
export const decrypt = (encryptedText: string): string => {
  const encryptionKey = process.env.ENCRYPTION_KEY;
  if (!encryptionKey || encryptionKey.length !== 64) {
    throw new Error('ENCRYPTION_KEY must be exactly 64 hex characters (32 bytes)');
  }

  const parts = encryptedText.split(':');
  if (parts.length !== 4) {
    throw new Error('Invalid encrypted text format');
  }

  const [ivHex, _saltHex, authTagHex, encryptedContent] = parts;
  const keyBuffer = Buffer.from(encryptionKey, 'hex');
  const iv = Buffer.from(ivHex as string, 'hex');
  const authTag = Buffer.from(authTagHex as string, 'hex');

  const decipher = crypto.createDecipheriv(ALGORITHM, keyBuffer, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedContent as string, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};
