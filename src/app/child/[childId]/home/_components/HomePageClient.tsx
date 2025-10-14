'use client';

import { useChildStore } from '@/store/useChildStore';
import GreetingSection from './GreetingSection';
import DashboardCards from './DashboardCards';

type Props = {
  childId: string;
};

export default function HomePageClient({ childId }: Props) {
  // 1. Zustand 스토어에서 모든 필요한 데이터를 가져옵니다.
  const { specifiedDone, emotionDone, rewardAvailable } = useChildStore();

  return (
    // 2. 전체적인 레이아웃을 잡고, 각 섹션에 필요한 데이터를 props로 전달합니다.
    <div className="max-w-[1260px] mx-auto flex flex-col gap-2.5">
      <GreetingSection childId={childId} specifiedDone={specifiedDone} />
      <DashboardCards
        emotionDone={emotionDone}
        rewardAvailable={rewardAvailable}
      />
    </div>
  );
}
