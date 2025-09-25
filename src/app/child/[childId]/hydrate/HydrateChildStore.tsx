// app/child/[childId]/hydrate/HydrateChildStore.tsx
'use client';

import { useEffect } from 'react';
import { useChildStore } from '@/store/useChildStore';

type Overview = {
  grapes: number;
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

  //overview prop이 변경될 때마다
  // 스토어가 항상 최신 상태를 반영하도록 합니다.
  useEffect(() => {
    setOverview(overview);
  }, [overview, setOverview]);

  return children;
}
