// lib/auth.ts
import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        name: { label: 'Name', type: 'text' }, // 사용자 이름만 받기
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.name) {
          throw new Error('이메일과 이름을 입력하세요.');
        }

        // 여기서 API로 로그인 요청 보내서 검증하는 부분
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/start/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: credentials.email,
            name: credentials.name, // 사용자 이름 보내기
          }),
        });

        const user = await res.json();

        if (!res.ok || !user) {
          throw new Error(user?.message || '로그인 실패');
        }

        return user.data; // 로그인 성공 시 user 데이터 반환
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // 세션을 수정하여 사용자 정보를 session.user에 포함
      if (token?.user) {
        session.user = token.user; // token.user가 세션에 저장
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = {
          email: user.email,  // 이메일
          name: user.name,    // 사용자 이름
        };
      }
      return token;
    },
  },
  session: {
    strategy: 'jwt',  // 세션 저장 방식을 JWT로 설정
  },
  secret: process.env.NEXTAUTH_SECRET, // 보안 비밀 키
  pages: {
    signIn: '/start/signin', // 로그인 페이지
  },
};
