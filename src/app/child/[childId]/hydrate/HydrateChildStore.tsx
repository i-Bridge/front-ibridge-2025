'use client';

import { useEffect } from 'react';
import { useChildStore } from '@/store/useChildStore';

// ✅ [수정] layout.tsx에서 전달하는 새로운 Overview 타입과 일치시킵니다.
type Overview = {
  childName: string;
  grapes: number;
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
    setOverview(overview);
  }, [overview, setOverview]);

  return children;
}
