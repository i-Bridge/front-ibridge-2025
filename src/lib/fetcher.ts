import axios from 'axios';
import { Session } from 'next-auth';
import { getServerSession } from 'next-auth';
import { getSession } from 'next-auth/react';
import { authOptions } from '@/lib/auth';

const isServer = typeof window === 'undefined';

export type FetcherOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: Record<string, unknown>;
  params?: Record<string, string | number>;
  headers?: Record<string, string>;
  skipAuthHeader?: boolean;
  session?: Session;
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

    if (!session) {
      if (isServer) {
        session = await getServerSession(authOptions);
      } else {
        session = await getSession();
      }
    }

    const accessToken = session?.accessToken;
    const provider = session?.provider;

    const baseHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    if (!options.skipAuthHeader) {
      if (!accessToken) {
        throw new Error('로그인이 필요한 요청입니다.');
      }
      baseHeaders['Authorization'] = `Bearer ${accessToken}`;
      baseHeaders['Provider'] = provider || '';
    }

    // ✅ 개발환경 로그 출력
    if (process.env.NODE_ENV === 'development') {
      console.log(
        '🌐 [Fetcher] 요청 URL:',
        `${process.env.NEXT_PUBLIC_API_URL}${url}`,
      );
      console.log('🛠 [Fetcher] 요청 메서드:', options.method ?? 'GET');
      console.log('📦 [Fetcher] 요청 데이터:', options.data);
      console.log('🔍 [Fetcher] 요청 파라미터:', options.params);
      console.log('🧾 [Fetcher] 요청 헤더:', baseHeaders);
      console.log('🔑 [Fetcher] 세션:', session);
    }

    const res = await axios({
      url: `${process.env.NEXT_PUBLIC_API_URL}${url}`,
      method: options.method ?? 'GET',
      headers: baseHeaders,
      ...(options.method !== 'GET' && options.data
        ? { data: options.data }
        : {}),
      params: options.params,
    });

    const responseData = res.data as ApiResponse<T>;

    if (process.env.NODE_ENV === 'development') {
      console.log('📥 [Fetcher] 응답 데이터:', responseData);
    }

    if (responseData.code !== '200') {
      console.warn(
        `⚠️ API 응답: 실패 [${responseData.code}]: ${responseData.message}`,
      );
    }

    return responseData;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const errorUrl = error.config?.url;
      const errorMessage =
        error.response?.data?.message || error.message || '서버 통신 오류';

      console.error(
        `❌ Axios Error [${status}] at ${errorUrl}: ${errorMessage}`,
        {
          response: error.response?.data,
        },
      );
    }

    console.error('❌ 일반 API Error:', error);
    throw error;
  }
}
