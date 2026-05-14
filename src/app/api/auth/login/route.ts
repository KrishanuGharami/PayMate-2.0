import { NextResponse } from 'next/server';
import { authRateLimit, setSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    // 1. Rate Limiting based on IP
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const { success, limit, remaining, reset } = await authRateLimit.limit(ip);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
          }
        }
      );
    }

    const { email, password, otp } = await request.json();

    // Mock Database User Check (In production, use adminAuth.getUserByEmail or Firestore)
    // For this prototype, we accept any valid-looking email for demonstration
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    // Phase 3.1: Multi-Factor Authentication
    if (!otp) {
        // If no OTP provided, respond indicating MFA is required
        return NextResponse.json({ requiresMfa: true }, { status: 200 });
    }

    if (otp !== '123456') {
        return NextResponse.json({ error: 'Invalid OTP code' }, { status: 401 });
    }

    // Phase 3.3: Session Protection via Secure JWT Cookie
    const mockUserId = `user_${Buffer.from(email).toString('base64').substring(0, 10)}`;
    await setSession(mockUserId, email);

    return NextResponse.json({ success: true, message: 'Login successful' });

  } catch (error: any) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
