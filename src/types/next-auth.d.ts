import NextAuth, { DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
      name?: string;
    } & DefaultSession['user'];
    accessToken?: string;
    error?: string;
    provider?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    provider?: string;
    error?: string;
    name?: string;
  }
}
