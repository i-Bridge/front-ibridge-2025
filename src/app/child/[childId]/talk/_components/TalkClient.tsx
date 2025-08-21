'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Fetcher } from '@/lib/fetcher';

type Props = {
  childId: string;
  initialCompleted: boolean;
  initialEmotionDone: boolean;
};

// 서버와 매핑된 emotion 정수값을 맞춰주세요.
const EMOTIONS = [
  { id: 1, label: '기쁨', emoji: '😊' },
  { id: 2, label: '슬픔', emoji: '😢' },
  { id: 3, label: '화남', emoji: '😠' },
  { id: 4, label: '놀람', emoji: '😮' },
  { id: 5, label: '걱정', emoji: '😟' },
];

export default function TalkClient({
  childId,
  initialCompleted,
  initialEmotionDone,
}: Props) {
  const childIdStr = useMemo(() => String(childId), [childId]);

  const [isCompleted] = useState<boolean>(initialCompleted);
  const [isEmotionDone, setIsEmotionDone] =
    useState<boolean>(initialEmotionDone);

  const [emotionModalOpen, setEmotionModalOpen] = useState(
    initialEmotionDone === false,
  );
  const [submittingEmotionId, setSubmittingEmotionId] = useState<number | null>(
    null,
  );

  // 👉 이모지 버튼 클릭 시 즉시 저장
  const submitEmotion = async (emotionId: number) => {
    if (submittingEmotionId !== null) return; // 중복 클릭 방지
    try {
      setSubmittingEmotionId(emotionId);
      console.log('📝 감정 전송:', emotionId);

      const { isSuccess } = await Fetcher<undefined>(
        `/child/${childId}/emotion`,
        {
          method: 'POST',
          data: { emotion: emotionId }, // ✅ FetcherOptions는 data 사용
        },
      );

      if (isSuccess) {
        console.log('✅ 감정 저장 성공');
        setEmotionModalOpen(false);
        setIsEmotionDone(true);
      } else {
        console.error('❌ 감정 저장 실패');
        // 실패 시 다시 선택 가능
      }
    } catch (e) {
      console.error('⚠️ 감정 저장 예외:', e);
    } finally {
      setSubmittingEmotionId(null);
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
            href={`/child/${childIdStr}/talk/question`}
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
          href={`/child/${childIdStr}/talk/free`}
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
      {emotionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[92vw] max-w-[420px] rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-xl font-bold text-center mb-1">
              오늘의 감정은?
            </h3>
            <p className="text-sm text-gray-500 text-center mb-4">
              지금 느끼는 감정을 선택해 주세요.
            </p>

            <div className="grid grid-cols-3 gap-3">
              {EMOTIONS.map((e) => {
                const busy = submittingEmotionId !== null;
                const isThisSubmitting = submittingEmotionId === e.id;
                return (
                  <button
                    key={e.id}
                    onClick={() => submitEmotion(e.id)}
                    disabled={busy}
                    className={`h-20 rounded-xl border flex flex-col items-center justify-center gap-1 transition relative
                      ${
                        isThisSubmitting
                          ? 'border-orange-400 ring-2 ring-orange-200 opacity-70'
                          : 'border-gray-200 hover:border-gray-300'
                      } ${busy && !isThisSubmitting ? 'opacity-50' : ''}`}
                  >
                    <span className="text-2xl">{e.emoji}</span>
                    <span className="text-sm">{e.label}</span>

                    {/* 로딩 인디케이터 (선택된 버튼에만) */}
                    {isThisSubmitting && (
                      <span className="absolute -bottom-2 text-[10px] text-orange-500">
                        저장 중...
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => {
                  console.log('❌ 감정 선택 취소');
                  setEmotionModalOpen(false);
                  // 취소 시 isEmotionDone은 여전히 false → 오늘의 질문 버튼 비활성 유지
                }}
                disabled={submittingEmotionId !== null}
                className="
    h-11 px-5 rounded-xl text-base  border-gray-300 bg-white text-orange-500
    hover:bg-gray-100 active:bg-gray-200
    focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-1
    disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400
    disabled:opacity-100
  "
              >
                나중에
              </button>
            </div>

            <p className="mt-3 text-xs text-gray-500 text-center">
              감정을 선택하면 바로 저장돼요.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
