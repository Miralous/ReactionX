export const RATE_LIMIT_CONFIG = {
  MAX_ATTEMPTS: 5,
  LOCK_TIME: 15 * 60 * 1000,
  RESET_TIME: 60 * 60 * 1000,
};

export interface RateLimitRecord {
  attempts: number;
  firstAttempt: number;
  lockedUntil?: number;
}

export const rateLimitMap = new Map<string, RateLimitRecord>();

export function cleanupExpiredRecords() {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now - record.firstAttempt > RATE_LIMIT_CONFIG.RESET_TIME) {
      rateLimitMap.delete(ip);
    }
  }
}

export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('cf-connecting-ip') || '127.0.0.1';
}

export function checkRateLimit(ip: string): { allowed: boolean; message?: string } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record) {
    return { allowed: true };
  }

  if (record.lockedUntil && now < record.lockedUntil) {
    const remainingTime = Math.ceil((record.lockedUntil - now) / 1000 / 60);
    return {
      allowed: false,
      message: `Too many attempts. Please try again in ${remainingTime} minutes.`
    };
  }

  if (now - record.firstAttempt > RATE_LIMIT_CONFIG.RESET_TIME) {
    rateLimitMap.delete(ip);
    return { allowed: true };
  }

  return { allowed: true };
}

export function recordFailedAttempt(ip: string) {
  const now = Date.now();
  const record = rateLimitMap.get(ip) || {
    attempts: 0,
    firstAttempt: now
  };

  record.attempts += 1;

  if (record.attempts >= RATE_LIMIT_CONFIG.MAX_ATTEMPTS) {
    record.lockedUntil = now + RATE_LIMIT_CONFIG.LOCK_TIME;
  }

  rateLimitMap.set(ip, record);
}

export function clearRecord(ip: string) {
  rateLimitMap.delete(ip);
}
