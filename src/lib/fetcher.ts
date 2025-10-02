import axios from 'axios';
import { Session } from 'next-auth';
import { getServerSession } from 'next-auth';
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

async function getFreshSession(): Promise<Session | null> {
  const res = await fetch('/api/auth/session');
  if (!res.ok) return null;
  return res.json();
}
export async function Fetcher<T = undefined>(
  url: string,
  options: FetcherOptions = {},
): Promise<ApiResponse<T>> {
  const fullUrl = `${process.env.NEXT_PUBLIC_API_URL}${url}`;

  try {
    let session: Session | null = null;

    if (!session) {
      if (isServer) {
        session = await getServerSession(authOptions);
      } else {
        session = await getFreshSession();
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

    const res = await axios({
      url: fullUrl,
      method: options.method ?? 'GET',
      headers: baseHeaders,
      ...(options.method !== 'GET' && options.data ? { data: options.data } : {}),
      params: options.params,
    });

    const responseData = res.data as ApiResponse<T>;

    if (responseData.code !== '200') {
      console.warn(
        `⚠️ API 응답 실패 [${responseData.code}] at ${fullUrl}: ${responseData.message}`,
        { response: responseData },
      );
    } else {
      console.log(`✅ API 호출 성공: ${fullUrl}`);
    }

    return responseData;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const errorMessage = error.response?.data?.message || error.message || '서버 통신 오류';
      const errorUrl = error.config?.url || fullUrl;

      console.error(
        `❌ Axios Error [${status}] at ${errorUrl}: ${errorMessage}`,
        { response: error.response?.data },
      );
    } else {
      console.error(`❌ 일반 API Error at ${fullUrl}:`, error);
    }
    throw error;
  }
}
