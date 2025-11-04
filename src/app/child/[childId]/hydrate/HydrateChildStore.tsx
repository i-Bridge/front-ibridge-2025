'use client';

import { useEffect } from 'react';
import { useChildStore } from '@/store/useChildStore';

type Overview = {
  childName: string;
  grapeBunches: number;
  grapePieces: number;
  rewardAvailable: boolean;
  emotion: number;
  emotionDone: boolean;
  specifiedDone: boolean;
};

export default function HydrateChildStore({
  overview,
  children,
}: {
  overview: Overview;
  children: React.ReactNode;
}) {
  const setOverview = useChildStore((s) => s.setOverview);

  useEffect(() => {
    if (overview) setOverview(overview); // ⬅️ 이 호출로 isOverviewReady=true 됨
  }, [overview, setOverview]);

  return children;
}
