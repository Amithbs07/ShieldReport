import crypto from 'crypto';

/**
 * Generates a unique 12-character alphanumeric case token.
 * Format: SHR-[4 CHARS]-[4 CHARS]
 */
export const generateCaseToken = (): string => {
  // Generate random bytes and use base64 encoding, stripping out confusing characters
  const randomStr = crypto.randomBytes(6).toString('base64')
    .toUpperCase()
    .replace(/[+/=O0I1]/g, '')
    .padEnd(8, 'X'); 
    
  return `SHR-${randomStr.substring(0, 4)}-${randomStr.substring(4, 8)}`;
};
