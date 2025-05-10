'use client';

import { useParams } from 'next/navigation';
import { Fetcher } from '@/lib/fetcher';

export const usePresignedUrl = () => {
  const { childId } = useParams();

  const getPresignedUrl = async (): Promise<string | null> => {
    if (!childId) return null;

    try {
      const { data, isSuccess } = await Fetcher<{ url: string }>(
        `/child/${childId}/getURL`,
        {
          method: 'GET',
          skipAuthHeader: true, // ✅ 인증 헤더 생략
        },
      );

      if (!isSuccess || !data?.url) {
        console.error('❌ Presigned URL 요청 실패');
        return null;
      }

      return data.url;
    } catch (err) {
      console.error('❌ Presigned URL 요청 중 오류 발생:', err);
      return null;
    }
  };

  return { getPresignedUrl };
};
