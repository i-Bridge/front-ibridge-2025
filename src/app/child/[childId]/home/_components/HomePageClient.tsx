'use client';

import { useChildStore } from '@/store/useChildStore';
import GreetingSection from './GreetingSection';
import DashboardCards from './DashboardCards';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Fetcher } from '@/lib/fetcher';
import { API } from '@/constants/api';
import { EmotionId } from '@/constants/emotions';
import EmotionModal from './EmotionModal'; // EmotionModal 경로를 확인해주세요.

type Props = {
  childId: string;
};

export default function HomePageClient({ childId }: Props) {
  const router = useRouter();

  // Zustand 스토어에서 모든 필요한 데이터를 가져옵니다.
  const { specifiedDone, emotionDone, grapes, setEmotionDone } =
    useChildStore();

  // ✅ [추가] 하이드레이션 깜빡임 방지 및 모달 상태 관리 로직
  const [isHydrated, setIsHydrated] = useState(false);
  const [isEmotionModalOpen, setIsEmotionModalOpen] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // ✅ [추가] 감정 선택 API를 호출하는 핸들러 함수
  const handleSelectEmotion = useCallback(
    async (emotionId: EmotionId) => {
      try {
        const { isSuccess } = await Fetcher<undefined>(API.emotion(childId), {
          method: 'POST',
          data: { emotion: emotionId },
        });

        if (isSuccess) {
          // Zustand 스토어 상태를 직접 업데이트합니다.
          setEmotionDone(true);
          // 서버 데이터 캐시를 갱신하여 페이지 전체의 일관성을 유지합니다.
          router.refresh();
          // 모달을 닫습니다.
          setIsEmotionModalOpen(false);
          return true;
        }
        return false;
      } catch (e) {
        console.error('감정 제출 실패', e);
        return false;
      }
    },
    [childId, router, setEmotionDone],
  );

  // 하이드레이션이 완료되기 전에는 렌더링하지 않아 UI 깜빡임을 방지합니다.
  if (!isHydrated) {
    return null;
  }

  return (
    <div className="max-w-[1260px] mx-auto flex flex-col gap-2.5">
      <GreetingSection childId={childId} specifiedDone={specifiedDone} />
      <DashboardCards
        emotionDone={emotionDone}
        grapes={grapes}
        // ✅ [수정] DashboardCards의 버튼 클릭 시 모달을 열도록 함수를 전달합니다.
        onEmotionSelectClick={() => setIsEmotionModalOpen(true)}
      />
      {/* ✅ [추가] 감정 선택 모달을 렌더링합니다. */}
      <EmotionModal
        open={isEmotionModalOpen}
        onClose={() => setIsEmotionModalOpen(false)}
        onSelect={handleSelectEmotion}
      />
    </div>
  );
}
