'use client';

import { useState } from 'react';
import type { EmotionId, EmotionOption } from '@/lib/constants';
import { EMOTIONS } from '@/lib/constants';

type EmotionModalProps = {
  /** 모달 열림 여부 */
  open: boolean;
  /** 모달 닫기 */
  onClose: () => void;
  /**
   * 감정 선택 시 호출되는 비동기 핸들러
   * true를 반환하면 모달이 자동으로 닫힙니다.
   */
  onSelect: (emotionId: EmotionId) => Promise<boolean>;
  /** 기본값: 전역 EMOTIONS */
  emotions?: readonly EmotionOption[];
};

export default function EmotionModal({
  open,
  onClose,
  onSelect,
  emotions = EMOTIONS,
}: EmotionModalProps) {
  const [submittingEmotionId, setSubmittingEmotionId] = useState<number | null>(
    null,
  );

  if (!open) return null;

  const busy = submittingEmotionId !== null;

  const handleClick = async (emotionId: EmotionId) => {
    if (busy) return; // 중복 클릭 방지
    try {
      console.log('📝 [EmotionModal] 감정 전송 클릭:', emotionId);
      setSubmittingEmotionId(emotionId);
      const ok = await onSelect(emotionId);
      if (ok) {
        console.log('✅ [EmotionModal] 감정 저장 성공 → 모달 닫기');
        onClose();
      } else {
        console.warn('❌ [EmotionModal] 감정 저장 실패(서버 응답)');
      }
    } catch (e) {
      console.error('⚠️ [EmotionModal] 감정 저장 예외:', e);
    } finally {
      setSubmittingEmotionId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[92vw] max-w-[420px] rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-xl text-gray-600 font-bold text-center mb-1">
          오늘의 감정은?
        </h3>
        <p className="text-sm text-gray-500 text-center mb-4">
          지금 느끼는 감정을 선택해 주세요.
        </p>

        <div className="grid grid-cols-3 gap-3">
          {emotions.map((e) => {
            const isThisSubmitting = submittingEmotionId === e.id;
            return (
              <button
                key={e.id}
                onClick={() => handleClick(e.id)}
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
            onClick={() => {
              console.log('❌ [EmotionModal] 감정 선택 취소');
              onClose();
            }}
            disabled={busy}
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
  );
}
