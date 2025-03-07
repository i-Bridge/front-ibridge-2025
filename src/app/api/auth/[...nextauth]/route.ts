import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import NaverProvider from 'next-auth/providers/naver';

const handler = NextAuth({
  providers: [
    // Google Provider 설정
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),

    // Naver Provider 설정
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID || '',
      clientSecret: process.env.NAVER_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
