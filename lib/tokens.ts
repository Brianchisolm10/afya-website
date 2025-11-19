import crypto from 'crypto';
import { prisma } from './db';

/**
 * Generate a cryptographically secure random token
 * @returns A random token string (64 characters hex)
 */
export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Hash a token using SHA-256
 * @param token - Plain token to hash
 * @returns Hashed token string
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Validate a token by checking expiration and usage status
 * @param token - Plain token to validate
 * @param type - Type of token (ACCOUNT_SETUP or PASSWORD_RESET)
 * @returns Object with validation result and token data if valid
 */
export async function validateToken(
  token: string,
  type: 'ACCOUNT_SETUP' | 'PASSWORD_RESET'
): Promise<{
  valid: boolean;
  tokenData?: {
    id: string;
    userId: string;
    expiresAt: Date;
  };
  error?: string;
}> {
  const hashedToken = hashToken(token);

  const tokenRecord = await prisma.inviteToken.findUnique({
    where: { token: hashedToken },
    select: {
      id: true,
      userId: true,
      type: true,
      expiresAt: true,
      usedAt: true,
    },
  });

  if (!tokenRecord) {
    return { valid: false, error: 'Token not found' };
  }

  if (tokenRecord.type !== type) {
    return { valid: false, error: 'Invalid token type' };
  }

  if (tokenRecord.usedAt) {
    return { valid: false, error: 'Token already used' };
  }

  if (new Date() > tokenRecord.expiresAt) {
    return { valid: false, error: 'Token expired' };
  }

  return {
    valid: true,
    tokenData: {
      id: tokenRecord.id,
      userId: tokenRecord.userId,
      expiresAt: tokenRecord.expiresAt,
    },
  };
}
