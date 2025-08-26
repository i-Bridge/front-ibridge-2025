// app/child/[childId]/hydrate/HydrateGameStore.tsx
'use client';

import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/useGameStore';

type Overview = {
  grapes: number;
  emotionDone: boolean;
  specifiedDone: boolean;
};

export default function HydrateGameStore({
  overview,
  children,
}: {
  overview: Overview;
  children: React.ReactNode;
}) {
  const hydratedRef = useRef(false);
  const setOverview = useGameStore((s) => s.setOverview);

  useEffect(() => {
    // StrictMode 중복 주입 방지
    if (hydratedRef.current) return;
    setOverview(overview);
    hydratedRef.current = true;
  }, [overview, setOverview]);

  return children;
}
