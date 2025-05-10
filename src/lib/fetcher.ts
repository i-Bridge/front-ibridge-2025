import axios from 'axios';
import { Session } from 'next-auth';
import { getServerSession } from 'next-auth';
import { getSession } from 'next-auth/react';
import { authOptions } from '@/lib/auth';

const isServer = typeof window === 'undefined';

export type FetcherOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: Record<string, unknown>;
  params?: Record<string, string | number>; //날짜 쿼리스트링으로 보냄
  headers?: Record<string, string>; //이메일 정보
};

export interface ApiResponse<T = undefined> {
  code: string;
  message: string;
  isSuccess?: boolean;
  data?: T;
}

const encodeHeaderValue = (value: string) => {
  return Buffer.from(value, 'utf-8').toString('base64');
};

export async function Fetcher<T = undefined>(
  url: string,
  options: FetcherOptions = {},
): Promise<ApiResponse<T>> { // data만 반환 X, 전체 ApiResponse 반환
  let userEmail = '';
  let userName = '';

  try {
    let session;

    if (isServer) {
      session = await getServerSession(authOptions);
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Server session:', session);  //추후 삭제 예정
      }
      userEmail = session?.user?.email ?? '';
      userName = session?.user?.name ?? '';
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
      console.log('👀 CSR session:', session);  //추후 삭제 예정
      userEmail = session?.user?.email ?? '';
      userName = session?.user?.name ?? '';
    }

    if (!userEmail) {
      throw new Error('로그인이 필요한 요청입니다.');
    }

    const isSignin =
      url === '/start/signin' && (options.method ?? 'GET') === 'POST';

    const res = await axios({
      url: `${process.env.NEXT_PUBLIC_API_URL}${url}`,
      method: options.method ?? 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Email': userEmail,
        ...(isSignin ? { 'X-User-Name': encodeHeaderValue(userName) } : {}),
        ...options.headers,
      },
      ...(options.method !== 'GET' && options.data
        ? { data: options.data }
        : {}),
      params: options.params,
    });

    const responseData = res.data as ApiResponse<T>;

    {/*code, error 오류 처리*/}

    if (responseData.code !== '200') {
      console.warn(
        `⚠️ API 응답: 실패 [${responseData.code}]: ${responseData.message}`,
      );
      return responseData;
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

      throw new Error(errorMessage);
    }

    console.error('❌ 일반 API Error:', error);
    throw new Error('알 수 없는 API 오류가 발생했습니다.');
  }
}
