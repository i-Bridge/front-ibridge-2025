'use client';

import { useState } from 'react';
import { EMOTIONS, type EmotionId } from '@/constants/emotions';
import { Button } from '@/ui/Button';
import CommonModalPopup from '@/ui/Modal/CommonModalPopup';
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
    <CommonModalPopup
      title="오늘의 감정은?"
      footerContent={
        <>
          <Button
            onClick={onClose}
            disabled={isSubmitting}
            variant={'grayscale'}
          >
            나중에 선택하기
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedEmotionId || isSubmitting}
            variant={'primary'}
          >
            선택 완료
          </Button>
        </>
      }
      onClose={onClose}
    >
      {/* ✅ [수정] Figma 스타일에 맞게 모달 컨테이너 변경 (w-[480px], rounded-[40px], 내부 패딩 제거) */}
      <div
        className="w-full self-stretch px-10 py-5 flex flex-col justify-center items-center"
        onClick={(e) => e.stopPropagation()} // 모달 클릭 시 닫히지 않도록
      >
        
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
    </CommonModalPopup>
  );
}
