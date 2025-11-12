import 'server-only'; // 이 파일은 서버에서만 사용됨을 명시
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { ApiError, type ApiResponse } from '@/types';

type FetcherOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: object;
  headers?: Record<string, string>;
  tags?: string[]; // Revalidation을 위한 태그
  skipAuthHeader?: boolean;
};

/**
 * 서버 컴포넌트 전용 데이터 페칭 함수.
 * 내부적으로 native fetch를 사용하여 Next.js 캐시 최적화를 활용합니다.
 * @param url API 엔드포인트 (e.g., '/users/me')
 * @param options Fetcher 옵션
 */
async function serverFetcher<T>(
  url: string,
  options: FetcherOptions = {},
): Promise<T> {
  const fullUrl = `${process.env.NEXT_PUBLIC_API_URL}${url}`;

  // 1. 서버 세션 가져오기
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken;

  const baseHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  // 2. 인증 헤더 추가 (apiClient와 동일한 로직)
  if (!options.skipAuthHeader) {
    if (!accessToken) {
      // 서버에서도 동일한 ApiError를 던져 일관성 유지
      throw new ApiError('로그인이 필요한 요청입니다.', 401, 'AUTH_REQUIRED');
    }
    baseHeaders['Authorization'] = `Bearer ${accessToken}`;
    baseHeaders['Provider'] = session?.provider || '';
  }

  try {
    const res = await fetch(fullUrl, {
      method: options.method ?? 'GET',
      headers: baseHeaders,
      body: options.body ? JSON.stringify(options.body) : undefined,
      // Next.js 캐싱 옵션
      next: {
        tags: options.tags, // revalidateTag를 위한 태그 설정
      },
    });

    const responseData: ApiResponse<T> = await res.json();

    // 3. 응답 처리 (apiClient와 동일한 로직)
    if (!res.ok || !responseData.isSuccess) {
      throw new ApiError(
        responseData.message,
        res.status,
        responseData.code,
      );
    }

    // 4. 성공 시 실제 데이터 반환 (apiClient와 동일한 로직)
    return responseData.data as T;

  } catch (error) {
    // 이미 ApiError인 경우 그대로 다시 던지기
    if (error instanceof ApiError) {
      throw error;
    }
    // 네트워크 오류 등 예측 못한 에러 처리
    throw new ApiError(
      error instanceof Error ? error.message : '알 수 없는 서버 오류가 발생했습니다.',
      500,
      'SERVER_ERROR',
    );
  }
}

// apiClient와 유사한 사용 경험을 위해 객체로 감싸서 export
export const serverApi = {
  get: <T>(url: string, options?: Omit<FetcherOptions, 'method' | 'body'>) =>
    serverFetcher<T>(url, { ...options, method: 'GET' }),
  post: <T>(url:string, body: object, options?: Omit<FetcherOptions, 'method' | 'body'>) =>
    serverFetcher<T>(url, { ...options, method: 'POST', body }),
  // ... put, patch, delete 등 필요에 따라 추가
};