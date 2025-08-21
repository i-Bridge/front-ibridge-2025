'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Fetcher } from '@/lib/fetcher';
import { API, ROUTES, type EmotionId } from '@/lib/constants';
import EmotionModal from './EmotionModal';

type Props = {
  childId: string;
  initialCompleted: boolean;
  initialEmotionDone: boolean;
};

export default function TalkClient({
  childId,
  initialCompleted,
  initialEmotionDone,
}: Props) {
  const [isCompleted] = useState<boolean>(initialCompleted);
  const [isEmotionDone, setIsEmotionDone] =
    useState<boolean>(initialEmotionDone);

  const [emotionModalOpen, setEmotionModalOpen] = useState(
    initialEmotionDone === false,
  );

  // 👉 모달에서 호출할 저장 핸들러 (성공 여부 boolean 반환)
  const handleSelectEmotion = async (
    emotionId: EmotionId,
  ): Promise<boolean> => {
    console.log('📝 [TalkClient] 감정 전송 시작:', emotionId);
    try {
      const { isSuccess } = await Fetcher<undefined>(API.emotion(childId), {
        method: 'POST',
        data: { emotion: emotionId },
      });

      if (isSuccess) {
        console.log('✅ [TalkClient] 감정 저장 성공');
        setIsEmotionDone(true);
        return true; // 성공 → 모달 자동 닫힘
      } else {
        console.error('❌ [TalkClient] 감정 저장 실패');
        return false;
      }
    } catch (e) {
      console.error('⚠️ [TalkClient] 감정 저장 예외:', e);
      return false;
    }
  };

  return (
    <section className="flex flex-col items-center gap-6 py-10 relative">
      <h2 className="text-2xl font-bold">오늘은 어떤 이야기를 나눠볼까요?</h2>
      <p className="text-lg font-bold">
        아래 버튼을 통해 대화를 시작해 보세요.
      </p>

      <div className="mt-4 flex flex-col gap-4">
        {/* 오늘의 질문 */}
        {isCompleted ? (
          <button
            disabled
            className="w-72 h-20 rounded-2xl bg-gray-300 text-gray-600 flex items-center justify-center text-xl font-bold cursor-not-allowed"
            title="오늘의 질문을 이미 완료했어요"
          >
            오늘의 질문
          </button>
        ) : (
          <Link
            href={ROUTES.talkQuestion(childId)}
            className={`w-72 h-20 rounded-2xl flex items-center justify-center text-xl font-bold hover:scale-105 transition-transform ${
              isEmotionDone === false
                ? 'bg-pink-200 pointer-events-none cursor-not-allowed'
                : 'bg-pink-300'
            }`}
            title={
              isEmotionDone === false ? '오늘의 감정을 먼저 선택해 주세요' : ''
            }
          >
            오늘의 질문
          </Link>
        )}

        {/* 하고싶은 말: 항상 가능 */}
        <Link
          href={ROUTES.talkFree(childId)}
          className="w-72 h-20 rounded-2xl bg-green-300 flex items-center justify-center text-xl font-bold hover:scale-105 transition-transform"
        >
          하고싶은 말
        </Link>

        {isCompleted && (
          <p className="text-sm text-gray-600 text-center">
            오늘의 질문은 이미 완료했어요. 하고 싶은 말이 있나요?
          </p>
        )}
        {isEmotionDone === false && (
          <p className="text-sm text-orange-600 text-center">
            오늘의 감정을 먼저 선택해 주세요.
          </p>
        )}
      </div>

      {/* 감정 선택 모달 */}
      <EmotionModal
        open={emotionModalOpen}
        onClose={() => {
          console.log('❌ [TalkClient] 모달 닫기');
          setEmotionModalOpen(false);
        }}
        onSelect={handleSelectEmotion}
      />
    </section>
  );
}
