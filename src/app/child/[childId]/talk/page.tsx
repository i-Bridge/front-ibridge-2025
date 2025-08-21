'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { Fetcher } from '@/lib/fetcher';

type HomeData = {
  emotion: boolean; // 오늘 감정 선택 여부
  completed: boolean; // 오늘의 질문 완료 여부
};

// 🔸 감정 매핑 테이블 (emotionId는 백엔드에서 정의한 int 값으로 맞춰줘야 함)
const EMOTIONS = [
  { id: 1, label: '기쁨', emoji: '😊' },
  { id: 2, label: '슬픔', emoji: '😢' },
  { id: 3, label: '화남', emoji: '😠' },
  { id: 4, label: '놀람', emoji: '😮' },
  { id: 5, label: '걱정', emoji: '😟' },
];

export default function TalkPage() {
  const { childId } = useParams();
  const numericChildId = useMemo(() => Number(childId), [childId]);

  const [isCompleted, setIsCompleted] = useState<boolean | null>(null);
  const [isEmotionDone, setIsEmotionDone] = useState<boolean | null>(null);

  // 팝업 상태
  const [emotionModalOpen, setEmotionModalOpen] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<number | null>(null);
  const [submittingEmotion, setSubmittingEmotion] = useState(false);

  // /home 호출
  useEffect(() => {
    if (!numericChildId) return;
    (async () => {
      console.log('📥 [/talk] /home API 호출');
      const { data, isSuccess } = await Fetcher<HomeData>(
        `/child/${numericChildId}/home`,
        { method: 'GET' },
      );
      if (isSuccess && data) {
        console.log('✅ [/talk] /home 응답 data:', data);
        setIsCompleted(data.completed);
        setIsEmotionDone(data.emotion);

        if (data.emotion === false) {
          console.log('🟡 오늘 감정 미설정 → 팝업 오픈');
          setEmotionModalOpen(true);
        }
      } else {
        console.error('❌ [/talk] /home API 실패');
        setIsCompleted(false);
        setIsEmotionDone(true);
      }
    })();
  }, [numericChildId]);

  // 감정 저장
  const submitEmotion = async () => {
    if (!selectedEmotion || !numericChildId) return;
    try {
      setSubmittingEmotion(true);
      console.log('📝 감정 전송:', selectedEmotion);

      const { isSuccess } = await Fetcher<{ isSuccess: boolean }>(
        `/child/${numericChildId}/emotion`,
        {
          method: 'POST',
          data: { emotion: selectedEmotion },
          headers: { 'Content-Type': 'application/json' },
        },
      );

      if (isSuccess) {
        console.log('✅ 감정 저장 성공');
        setEmotionModalOpen(false);
        setIsEmotionDone(true);
      } else {
        console.error('❌ 감정 저장 실패');
      }
    } catch (e) {
      console.error('⚠️ 감정 저장 중 예외:', e);
    } finally {
      setSubmittingEmotion(false);
    }
  };

  return (
    <section className="flex flex-col items-center gap-6 py-10 relative">
      <h2 className="text-2xl font-bold"> 오늘은 어떤 이야기를 나눠볼까요?</h2>
      <p className="text-lg font-bold">
        {' '}
        아래 버튼을 통해 대화를 시작해 보세요.
      </p>

      <div className="mt-4 flex flex-col gap-4">
        {/* 로딩 상태 */}
        {isCompleted === null && (
          <div className="w-72 h-20 rounded-2xl bg-gray-200 animate-pulse flex items-center justify-center">
            <span className="opacity-60">불러오는 중...</span>
          </div>
        )}

        {/* 오늘의 질문 */}
        {isCompleted !== null &&
          (isCompleted ? (
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
                isEmotionDone === false
                  ? '오늘의 감정을 먼저 선택해 주세요'
                  : ''
              }
            >
              오늘의 질문
            </Link>
          ))}

        {/* 하고싶은 말: 항상 가능 */}
        <Link
          href={`/child/${childId}/talk/free`}
          className="w-72 h-20 rounded-2xl bg-green-300 flex items-center justify-center text-xl font-bold hover:scale-105 transition-transform"
        >
          하고싶은 말
        </Link>

        {isCompleted === true && (
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

      {/* 감정 선택 팝업 */}
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
                const active = selectedEmotion === e.id;
                return (
                  <button
                    key={e.id}
                    onClick={() => {
                      console.log('😀 감정 선택:', e);
                      setSelectedEmotion(e.id);
                    }}
                    className={`h-20 rounded-xl border flex flex-col items-center justify-center gap-1 transition
                      ${active ? 'border-orange-400 ring-2 ring-orange-200' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <span className="text-2xl">{e.emoji}</span>
                    <span className="text-sm">{e.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex gap-3">
              <button
                onClick={() => {
                  console.log('❌ 감정 선택 취소');
                  setEmotionModalOpen(false);
                }}
                className="flex-1 h-12 rounded-xl border border-gray-300 hover:bg-gray-50 transition"
              >
                나중에
              </button>
              <button
                onClick={submitEmotion}
                disabled={!selectedEmotion || submittingEmotion}
                className={`flex-1 h-12 rounded-xl text-white transition
                  ${
                    !selectedEmotion || submittingEmotion
                      ? 'bg-orange-300 cursor-not-allowed'
                      : 'bg-orange-500 hover:bg-orange-600'
                  }`}
              >
                {submittingEmotion ? '저장 중...' : '선택 완료'}
              </button>
            </div>

            <p className="mt-3 text-xs text-gray-500 text-center">
              감정 선택을 완료하면 오늘의 질문을 시작할 수 있어요.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
