'use client';

import { useParams } from 'next/navigation';
import { Fetcher } from '@/lib/fetcher';

type UploadType = 'video' | 'thumbnail';

export const usePresignedUrl = () => {
  const { childId } = useParams();

  const getPresignedUrl = async (type: UploadType): Promise<string | null> => {
    if (!childId) {
      console.error('❌ childId 없음');
      return null;
    }

    const endpoint =
      type === 'video'
        ? `/child/${childId}/getURL/video`
        : `/child/${childId}/getURL/image`;

    try {
      const { data, isSuccess } = await Fetcher<{ url: string }>(endpoint, {
        method: 'GET',
        skipAuthHeader: true,
      });

      if (!isSuccess || !data?.url) {
        console.error('❌ presigned URL 응답 실패:', data);
        return null;
      }

      return data.url;
    } catch (err) {
      console.error('❌ presigned URL 요청 중 오류 발생:', err);
      return null;
    }
  };

  return { getPresignedUrl };
};
