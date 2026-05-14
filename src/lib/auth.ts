import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { Ratelimit } from '@upstash/ratelimit';
import { redis } from './redis';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-super-secret-key-12345');

// Rate limiter: 5 requests per 10 seconds per IP
export const authRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '10 s'),
  analytics: true,
});

export const paymentRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '60 s'),
});

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(JWT_SECRET);
}

export async function decrypt(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get('paymate_session')?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function setSession(userId: string, email: string) {
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  const session = await encrypt({ userId, email, expires });
  
  const cookieStore = await cookies();
  cookieStore.set('paymate_session', session, {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete('paymate_session');
}
