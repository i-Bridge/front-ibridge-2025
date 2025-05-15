'use client';

import { useParams } from 'next/navigation';
import { Fetcher } from '@/lib/fetcher';

type UploadType = 'video' | 'image';

export const usePresignedUrl = () => {
  const { childId } = useParams();

  /**
   * @param type - 'video' 또는 'image' (썸네일)
   * @param id - 답변 등록 시 받은 id
   */
  const getPresignedUrl = async (
    type: UploadType,
    id: number,
  ): Promise<string | null> => {
    if (!childId) {
      console.error('❌ childId 없음');
      return null;
    }

    try {
      const { data, isSuccess } = await Fetcher<{ url: string }>(
        `/child/${childId}/getURL`,
        {
          method: 'POST',
          data: {
            type,
            id,
          },
          skipAuthHeader: true,
        },
      );

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
