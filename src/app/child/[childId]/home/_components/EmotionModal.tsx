'use client';

import { useState } from 'react';
import type { EmotionId, EmotionOption } from '@/constants/emotions';
import { EMOTIONS } from '@/constants/emotions';

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
  // --- 상태 관리 로직 변경 ---
  // 1. 현재 '선택된' 감정을 관리하는 상태 추가
  const [selectedEmotionId, setSelectedEmotionId] = useState<EmotionId | null>(
    null,
  );
  // 2. '제출 중' 상태를 boolean으로 관리
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!open) return null;

  /** 감정 아이콘 클릭 핸들러: 클릭 시 선택된 감정 상태만 변경 */
  const handleEmotionClick = (emotionId: EmotionId) => {
    if (isSubmitting) return; // 제출 중에는 선택 변경 불가
    // 이미 선택된 감정을 다시 클릭하면 선택 해제
    setSelectedEmotionId((prev) => (prev === emotionId ? null : emotionId));
  };

  /** '선택 완료' 버튼 클릭 핸들러: onSelect API 호출 */
  const handleSubmit = async () => {
    // 선택된 감정이 없거나, 이미 제출 중이면 중복 실행 방지
    if (!selectedEmotionId || isSubmitting) return;

    try {
      console.log('📝 [EmotionModal] 감정 전송 시작:', selectedEmotionId);
      setIsSubmitting(true);
      const ok = await onSelect(selectedEmotionId);

      if (ok) {
        console.log('✅ [EmotionModal] 감정 저장 성공 → 모달 닫기');
        onClose();
      } else {
        console.warn('❌ [EmotionModal] 감정 저장 실패 (서버 응답)');
        // 필요하다면 여기에 사용자에게 실패 피드백을 주는 UI를 추가할 수 있습니다.
      }
    } catch (e) {
      console.error('⚠️ [EmotionModal] 감정 저장 중 예외 발생:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // --- 디자인 시스템 반영 ---
    // 전체적인 레이아웃과 스타일을 시안에 맞게 수정
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-[480px] rounded-[40px] bg-white p-10 shadow-xl flex flex-col space-y-8">
        {/* 헤더 */}
        <div className="pt-2">
          <h3 className="text-[28px] font-extrabold text-gray-800 text-center leading-[1.4]">
            오늘의 감정은?
          </h3>
        </div>

        {/* 감정 선택 그리드 */}
        <div className="grid grid-cols-3 gap-5">
          {emotions.map((e) => {
            const isSelected = selectedEmotionId === e.id;
            return (
              <button
                key={e.id}
                onClick={() => handleEmotionClick(e.id)}
                disabled={isSubmitting}
                className={`
                  aspect-square rounded-full border-2 flex items-center justify-center transition-all duration-200 transform
                  ${isSelected ? 'border-orange-500 ring-4 ring-orange-100 scale-105' : 'border-gray-200 hover:border-gray-400'}
                  ${isSubmitting ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105 active:scale-100'}
                `}
              >
                <span className="text-5xl">{e.emoji}</span>
              </button>
            );
          })}
        </div>

        {/* 액션 버튼 */}
        <div className="flex w-full gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full h-16 rounded-full text-xl font-bold bg-gray-100 text-gray-70 hover:bg-gray-200 transition-colors disabled:opacity-60"
          >
            나중에 선택하기
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedEmotionId || isSubmitting}
            className="w-full h-16 rounded-full text-xl font-bold bg-primary text-white hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '저장 중...' : '선택 완료'}
          </button>
        </div>
      </div>
    </div>
  );
}
