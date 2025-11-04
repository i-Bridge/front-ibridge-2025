'use client';

import { useChildStore } from '@/store/useChildStore';
import GreetingSection from './GreetingSection';
import DashboardCards from './DashboardCards';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Fetcher } from '@/lib/fetcher';
import { API } from '@/constants/api';
import { EmotionId } from '@/constants/emotions';
import EmotionModal from './EmotionModal';

type Props = {
  childId: string;
};

export default function HomePageClient({ childId }: Props) {
  const router = useRouter();

  // ✅ [수정] 스토어에서 새로운 데이터 구조에 맞는 값들과 액션을 가져옵니다.
  const {
    specifiedDone,
    emotionDone,
    rewardAvailable,
    grapePieces,
    emotion,
    setEmotionDone,
    setGrapeState,
  } = useChildStore();

  const [isHydrated, setIsHydrated] = useState(false);
  const [isEmotionModalOpen, setIsEmotionModalOpen] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleSelectEmotion = useCallback(
    async (emotionId: EmotionId) => {
      try {
        const { isSuccess } = await Fetcher<undefined>(API.emotion(childId), {
          method: 'POST',
          data: { emotion: emotionId },
        });
        if (isSuccess) {
          setEmotionDone(true);
          router.refresh();
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

  // ✅ [수정] '한 송이 받기' 버튼 클릭 시 새로운 /getBunch API를 호출하도록 수정합니다.
  const handleClaimReward = useCallback(async () => {
    if (isClaiming) return;
    setIsClaiming(true);
    try {
      const { data, isSuccess } = await Fetcher<{
        grapeBunches: number;
        grapePieces: number;
        available: boolean; // 백엔드 응답은 'available'
      }>(API.getBunch(childId), { method: 'POST' });

      if (isSuccess && data) {
        console.log('포도송이 받기 성공:', data);
        // 백엔드 응답을 프론트엔드 스토어 상태에 맞게 매핑하여 업데이트합니다.
        setGrapeState({
          grapeBunches: data.grapeBunches,
          grapePieces: data.grapePieces,
          rewardAvailable: data.available,
        });
      }
    } catch (e) {
      console.error('포도송이 받기 실패:', e);
    } finally {
      setIsClaiming(false);
    }
  }, [childId, setGrapeState, isClaiming]);

  if (!isHydrated) {
    return null;
  }

  return (
    <div className="max-w-[1340px] h-full self-stretch w-full flex flex-col gap-5 overflow-y-auto">
      <GreetingSection childId={childId} specifiedDone={specifiedDone} />
      <DashboardCards
        emotionDone={emotionDone}
        rewardAvailable={rewardAvailable}
        grapePieces={grapePieces}
        onEmotionSelectClick={() => setIsEmotionModalOpen(true)}
        onClaimReward={handleClaimReward}
        isClaiming={isClaiming}
        emotion={emotion}
      />
      <EmotionModal
        open={isEmotionModalOpen}
        onClose={() => setIsEmotionModalOpen(false)}
        onSelect={handleSelectEmotion}
      />
    </div>
  );
}
