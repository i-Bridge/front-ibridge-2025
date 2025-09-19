'use client';

import Link from 'next/link';
import { Fetcher } from '@/lib/fetcher';
import { API, type EmotionId } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { useChildStore } from '@/store/useChildStore';
import EmotionModal from './EmotionModal';

type Props = {
  childId: string; // ✅ string으로 고정
};

export default function TalkMenu({ childId }: Props) {
  const router = useRouter(); // 라우터 사용

  const { emotionDone, specifiedDone, setEmotionDone } = useChildStore();

  const isEmotionModalOpen = emotionDone === false;

  // 이모지 클릭 → 즉시 저장
  const handleSelectEmotion = async (emotionId: EmotionId) => {
    try {
      const { isSuccess } = await Fetcher<undefined>(API.emotion(childId), {
        method: 'POST',
        data: { emotion: emotionId },
      });

      if (isSuccess) {
        // ✨ 5. Zustand 스토어 상태를 직접 업데이트합니다.
        setEmotionDone(true);

        // ✨ 6. 서버 데이터 캐시를 갱신합니다. (뒤로가기 문제 해결)
        router.refresh();

        return true; // 성공했음을 EmotionModal에 알림
      }
      return false;
    } catch (e) {
      console.error('감정 제출 실패', e);
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
        {specifiedDone ? (
          <button
            disabled
            className="w-72 h-20 rounded-2xl bg-gray-300 text-gray-600 flex items-center justify-center text-xl font-bold cursor-not-allowed"
            title="오늘의 질문을 이미 완료했어요"
          >
            오늘의 질문
          </button>
        ) : (
          <Link
            href={`/child/${childId}/talk/question`}
            className={`w-72 h-20 rounded-2xl flex items-center justify-center text-xl font-bold hover:scale-105 transition-transform ${
              emotionDone === false
                ? 'bg-pink-200 pointer-events-none cursor-not-allowed'
                : 'bg-pink-300'
            }`}
            title={
              emotionDone === false ? '오늘의 감정을 먼저 선택해 주세요' : ''
            }
          >
            오늘의 질문
          </Link>
        )}

        <Link
          href={`/child/${childId}/talk/free`}
          className="w-72 h-20 rounded-2xl bg-green-300 flex items-center justify-center text-xl font-bold hover:scale-105 transition-transform"
        >
          하고싶은 말
        </Link>

        {specifiedDone && (
          <p className="text-sm text-gray-600 text-center">
            오늘의 질문은 이미 완료했어요. 하고 싶은 말이 있나요?
          </p>
        )}
      </div>

      {/* 감정 선택 모달 */}
      <EmotionModal
        open={isEmotionModalOpen}
        onClose={() => setEmotionDone(true)}
        onSelect={handleSelectEmotion}
      />
    </section>
  );
}
