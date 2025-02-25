//  Next.js 서버(Edge Runtime)에서 자동 실행
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decode } from 'jsonwebtoken'; // jsonwebtoken 라이브러리 설치 필요

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value; // 쿠키에서 Access Token 가져오기

  if (!token) {
    // 토큰이 없으면 "/" 경로로 리다이렉트
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  try {
    // 토큰 검증 (서명 검증은 서버에서 수행해야 함)
    const decoded = decode(token); // 여기서는 단순 디코딩 (서명 검증은 생략)
    if (!decoded) throw new Error('Invalid token');
  } catch (error) {
    console.error('Invalid or expired token:', error);

    // 토큰이 유효하지 않으면 "/" 경로로 리다이렉트
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // 유효한 토큰이면 요청 진행
  return NextResponse.next();
}

// 특정 경로에만 미들웨어 적용
export const config = {
  matcher: [
    '/parent/:path*', // "/parent" 및 하위 모든 경로 보호
    '/child/:path*', // "/child" 및 하위 모든 경로 보호
    '!/', // "/"은 제외
  ],
};
