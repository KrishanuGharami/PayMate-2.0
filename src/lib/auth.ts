import { Ratelimit } from '@upstash/ratelimit';
import { redis } from './redis';

// Rate limiter: 5 requests per 10 seconds per IP (for auth-related endpoints)
export const authRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '10 s'),
  analytics: true,
});

// Rate limiter: 3 requests per 60 seconds per user (for payment endpoints)
export const paymentRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '60 s'),
});
