import { cookies } from 'next/headers';
import { ApiResponse } from '@/types';

export async function serverFetch<T = undefined, U extends object = {}, H extends object = {}>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T, U, H>> {
  // cookies()는 비동기적으로 처리해야 함
  const cookieStore = await cookies();
  const userEmail = cookieStore.get('userEmail')?.value;

  if (!userEmail) {
    throw new Error('로그인 정보가 없습니다.');
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
    'X-User-Email': userEmail,
  };

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    ...options,
    credentials: 'include',
    headers,
    cache: 'no-store', // 캐싱 안 함
  });

  if (!res.ok) {
    console.error('Fetch 실패:', res.statusText);
    throw new Error(`서버 요청 실패: ${res.statusText}`);
  }

  const json = await res.json();

  if (json.code !== '200') {
    console.error('API 코드 실패:', json.message);
    throw new Error(`API 실패 (code=${json.code}): ${json.message}`);
  }

  if ('isSuccess' in json && json.isSuccess === false) {
    console.error('API isSuccess 실패:', json.message);
    throw new Error(`API 실패 (isSuccess=false): ${json.message}`);
  }

  return json;
}
