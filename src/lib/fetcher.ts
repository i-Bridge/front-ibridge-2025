import axios from 'axios';
import { Session } from 'next-auth';
import { getServerSession } from 'next-auth';
import { getSession } from 'next-auth/react';
import { authOptions } from '@/lib/auth';

const isServer = typeof window === 'undefined';

export type FetcherOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: Record<string, any>;
  params?: Record<string, string | number>;
  headers?: Record<string, string>;
};

export interface ApiResponse<T = undefined> {
  code: string;
  message: string;
  isSuccess?: boolean;
  data?: T;
}

export async function Fetcher<T = undefined>(
  url: string,
  options: FetcherOptions = {},
): Promise<ApiResponse<T>> {
  try {
    let session: Session | null = null;

    if (isServer) {
      session = await getServerSession(authOptions);
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Server session:', session);
      }
    } else {
      session = await new Promise<Session | null>((resolve) => {
        const start = Date.now();
        const interval = setInterval(async () => {
          const sess = await getSession();
          if (sess || Date.now() - start > 3000) {
            clearInterval(interval);
            resolve(sess ?? null);
          }
        }, 100);
      });
      console.log('👀 CSR session:', session);
    }

    const accessToken = session?.accessToken;

    if (!accessToken) {
      throw new Error('로그인이 필요한 요청입니다.');
    }

    const res = await axios({
      url: `${process.env.NEXT_PUBLIC_API_URL}${url}`,
      method: options.method ?? 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`, // ✅ accessToken만 전달
        ...options.headers,
      },
      ...(options.method !== 'GET' && options.data
        ? { data: options.data }
        : {}),
      params: options.params,
    });

    const responseData = res.data as ApiResponse<T>;

    if (responseData.code !== '200') {
      throw new Error(
        responseData.message || 'API 요청 중 오류가 발생했습니다.',
      );
    }

    return responseData;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('❌ axios error:', error.response?.data);
      throw new Error(
        error.response?.data?.message || error.message || '서버 통신 오류',
      );
    }
    console.error('❌ 일반 error:', error);
    throw new Error('서버 통신 오류');
  }
}
