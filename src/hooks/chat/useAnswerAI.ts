'use client';

import { useParams } from 'next/navigation';
import { Fetcher } from '@/lib/fetcher';

export const useAnswerAI = () => {
  const { childId } = useParams();

  const postAnswer = async ({
    isFinished,
    video,
    thumbnail,
  }: {
    isFinished: boolean;
    video: string;
    thumbnail: string;
  }): Promise<string | null> => {
    try {
      const { data, isSuccess } = await Fetcher<{ ai: string }>(
        `/child/${childId}/answer`,
        {
          method: 'POST',
          data: {
            isFinished,
            video,
            thumbnail,
          },
        },
      );

      if (!isSuccess || !data?.ai) {
        console.error('AI 응답 실패');
        return null;
      }

      return data.ai;
    } catch (err) {
      console.error('AI 요청 중 오류 발생:', err);
      return null;
    }
  };

  return { postAnswer };
};
