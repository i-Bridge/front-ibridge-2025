'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Fetcher } from '@/lib/fetcher';
import { EMOTIONS, API, type EmotionId } from '@/lib/constants';

type Props = {
  childId: string; // ✅ string으로 고정
  initialCompleted: boolean;
  initialEmotionDone: boolean;
};

export default function TalkMenu({
  childId,
  initialCompleted,
  initialEmotionDone,
}: Props) {
  const [isCompleted] = useState(initialCompleted);
  const [isEmotionDone, setIsEmotionDone] = useState(initialEmotionDone);

  const [emotionModalOpen, setEmotionModalOpen] = useState(
    initialEmotionDone === false,
  );
  const [submittingEmotionId, setSubmittingEmotionId] = useState<number | null>(
    null,
  );

  // 이모지 클릭 → 즉시 저장
  const submitEmotion = async (emotionId: EmotionId) => {
    if (submittingEmotionId !== null) return;
    try {
      setSubmittingEmotionId(emotionId);
      const { isSuccess } = await Fetcher<undefined>(API.emotion(childId), {
        method: 'POST',
        data: { emotion: emotionId },
      });
      if (isSuccess) {
        setEmotionModalOpen(false);
        setIsEmotionDone(true);
      }
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
            href={`/child/${childId}/talk/question`}
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

        <Link
          href={`/child/${childId}/talk/free`}
          className="w-72 h-20 rounded-2xl bg-green-300 flex items-center justify-center text-xl font-bold hover:scale-105 transition-transform"
        >
          하고싶은 말
        </Link>

        {isCompleted && (
          <p className="text-sm text-gray-600 text-center">
            오늘의 질문은 이미 완료했어요. 하고 싶은 말이 있나요?
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
                    onClick={() => submitEmotion(e.id as EmotionId)}
                    disabled={busy}
                    className={`h-20 rounded-xl border flex flex-col items-center justify-center gap-1 transition relative
                      ${isThisSubmitting ? 'border-orange-400 ring-2 ring-orange-200 opacity-70' : 'border-gray-200 hover:border-gray-300'}
                      ${busy && !isThisSubmitting ? 'opacity-50' : ''}`}
                  >
                    <span className="text-2xl">{e.emoji}</span>
                    <span className="text-sm">{e.labelKo}</span>
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
                onClick={() => setEmotionModalOpen(false)}
                disabled={submittingEmotionId !== null}
                className="h-11 px-5 rounded-xl text-base font-semibold
                           border border-gray-300 bg-white text-gray-800
                           hover:bg-gray-100 active:bg-gray-200
                           focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-1
                           disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:opacity-100"
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
