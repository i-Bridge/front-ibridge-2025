'use client';

import { useState } from 'react';
import { EMOTIONS, type EmotionId } from '@/constants/emotions';

type EmotionModalProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (emotionId: EmotionId) => Promise<boolean>;
};

export default function EmotionModal({
  open,
  onClose,
  onSelect,
}: EmotionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEmotionId, setSelectedEmotionId] = useState<EmotionId | null>(
    null,
  );

  if (!open) return null;

  const handleConfirm = async () => {
    if (isSubmitting || !selectedEmotionId) return;
    setIsSubmitting(true);
    try {
      const success = await onSelect(selectedEmotionId);
      if (success) {
        setSelectedEmotionId(null);
        onClose();
      }
    } catch (e) {
      console.error('Emotion selection failed', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmotionClick = (emotionId: EmotionId) => {
    setSelectedEmotionId(emotionId);
  };

  return (
    <div
      className="absolute inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* ✅ [수정] Figma 스타일에 맞게 모달 컨테이너 변경 (w-[480px], rounded-[40px], 내부 패딩 제거) */}
      <div
        className="w-[480px] bg-white rounded-[40px] shadow-xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()} // 모달 클릭 시 닫히지 않도록
      >
        {/* ✅ [수정] Figma 스타일에 맞게 타이틀 섹션 변경 */}
        <div className="px-10 pt-12 pb-5 bg-white">
          <h3 className="text-center text-gray-900 text-3xl font-extrabold leading-10">
            오늘의 감정은?
          </h3>
        </div>

        {/* ✅ [수정] Figma 스타일에 맞게 아이콘 그리드 래퍼 변경 (px-10 py-5) */}
        <div className="px-10 py-5 bg-white">
          <div className="grid grid-cols-3 gap-5">
            {EMOTIONS.map((emotion) => {
              const EmotionIcon = emotion.icon;
              const isSelected = selectedEmotionId === emotion.id;
              return (
                <button
                  key={emotion.id}
                  onClick={() => handleEmotionClick(emotion.id)}
                  disabled={isSubmitting}
                  className={`
            w-28 h-28 rounded-full flex items-center justify-center
            transition-opacity duration-200
            ${isSelected ? 'ring-4 ring-primary-primaryLight' : 'ring-2 ring-transparent'}
            ${isSubmitting ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90'}
            focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-primaryLight
          `}
                >
                  <EmotionIcon className="w-full h-full" />
                </button>
              );
            })}
          </div>
        </div>

        {/* ✅ [수정] Figma 스타일에 맞게 하단 버튼 섹션 변경 (p-5, gap-3) */}
        <div className="self-stretch p-5 bg-white">
          <div className="flex justify-center gap-3">
            {/* ✅ [수정] Figma 스타일에 맞게 버튼 크기, 패딩, 폰트 변경 */}
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 h-16 px-10 py-5 bg-gray-10 text-gray-700 rounded-full 
                         text-xl font-extrabold font-['Tmoney_RoundWind'] leading-8
                         hover:bg-gray-50 transition-colors disabled:opacity-60"
            >
              나중에 선택하기
            </button>
            {/* ✅ [수정] Figma 스타일에 맞게 버튼 크기, 패딩, 폰트 변경 */}
            <button
              onClick={handleConfirm}
              disabled={!selectedEmotionId || isSubmitting}
              className="flex-1 h-16 px-10 py-5 bg-primary-primary text-white rounded-full 
                         text-xl font-extrabold leading-8
                         hover:bg-primary/90 transition-colors 
                         disabled:bg-primary/40 disabled:cursor-not-allowed"
            >
              선택 완료
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
