import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // ✅ 로그인 안 한 경우
  if (!token) {
    // ❗ '/'는 허용, 나머지는 '/'로 리디렉션
    if (req.nextUrl.pathname !== '/') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}

// ✅ 보호할 경로 지정
export const config = {
  matcher: ['/((?!_next|api|favicon.ico).*)'], // '/' 제외한 모든 경로 보호
};
