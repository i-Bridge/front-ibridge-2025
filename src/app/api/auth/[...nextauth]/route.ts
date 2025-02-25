import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Spring Boot 백엔드로 로그인 요청
        const res = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: credentials?.username,
            password: credentials?.password,
          }),
        });

        const user = await res.json();

        if (res.ok && user) {
          return {
            accessToken: user.accessToken,
            refreshToken: user.refreshToken,
            id: user.id,
          };
        }
        throw new Error('Invalid credentials');
      },
    }),
  ],
  session: {
    strategy: 'jwt', // JWT 기반 세션 관리
    maxAge: 60 * 60, // Access Token 만료 시간 (1시간)
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }

      // Access Token 만료 시 Refresh Token 사용
      const isAccessTokenExpired = Date.now() > (token.expiresAt || 0);
      if (isAccessTokenExpired && token.refreshToken) {
        const refreshedTokens = await fetch(
          `${process.env.BACKEND_URL}/auth/refresh`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: token.refreshToken }),
          },
        ).then((res) => res.json());

        token.accessToken = refreshedTokens.accessToken;
        token.expiresAt = Date.now() + refreshedTokens.expiresIn * 1000; // 새 만료 시간
      }

      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user.id = token.id;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
