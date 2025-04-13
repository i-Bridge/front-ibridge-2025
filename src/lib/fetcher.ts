import axios from 'axios';
import { getServerSession } from 'next-auth';
import { getSession } from 'next-auth/react';
import { authOptions } from '@/lib/auth'; // 필요하면 경로 수정

type FetcherOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: Record<string, unknown>;
  params?: Record<string, string | number>;
  headers?: Record<string, string>;
};

// 파일 안에 isServer 같이 정의
function isServer() {
  return typeof window === 'undefined';
}



export async function Fetcher<T = any, U = {}>(url: string, options: FetcherOptions = {}): Promise<T & U> {
  let userEmail = '';

  if (isServer()) {
    const session = await getServerSession(authOptions);
    console.log('Server session:', session); // 로깅
    userEmail = session?.user?.email || '';
  } else {
    const session = await getSession();
    userEmail = session?.user?.email || '';
  }

  try {
    const res = await axios({
      url: `${process.env.NEXT_PUBLIC_API_URL}${url}`,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Email': userEmail,
        ...options.headers,
      },
      data: options.data,
      params: options.params,
      withCredentials: true,
    });

    const responseData = res.data;

    if (responseData.code !== '200') {
      throw new Error(responseData.message || 'API 요청 중 오류가 발생했습니다.');
    }

    return responseData as T & U; // responseData가 T와 U를 모두 만족하도록
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message || '서버 통신 오류');
    }
    throw new Error('서버 통신 오류');
  }
}
