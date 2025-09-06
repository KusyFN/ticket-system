import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin'; // 環境変数からパスワードを取得、デフォルトは'admin'
const COOKIE_NAME = 'admin_auth';
const MAX_AGE = 60 * 60 * 24 * 365; // 1 year in seconds

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (password === ADMIN_PASSWORD) {
      const cookie = serialize(COOKIE_NAME, 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        maxAge: MAX_AGE,
        path: '/',
        sameSite: 'lax',
      });

      return new NextResponse(JSON.stringify({ message: 'Authenticated' }), {
        status: 200,
        headers: { 'Set-Cookie': cookie },
      });
    } else {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
