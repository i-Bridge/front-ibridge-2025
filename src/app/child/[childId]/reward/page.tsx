'use client';

import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '@/store/useGameStore';
import GrapeCluster from './_components/GrapeCluster';

const GRAPES_PER_BUNCH = 6;
const toBunches = (g: number) => Math.floor(g / GRAPES_PER_BUNCH);

export default function RewardPage() {
  // 전역: 알(서버 원장 단위)
  const grapes = useGameStore((s) => s.grapes);

  // 로컬(연출)
  const [filled, setFilled] = useState(0); // 현재 클러스터에 채워진 알(0~6)
  const [localBunchGain, setLocalBunchGain] = useState(0); // 화면에서만 보이는 추가 송이
  const userTouchedRef = useRef(false); // 사용자가 버튼을 눌러 UI를 변경했는지

  // ✅ 상단 표시용 송이 수
  const displayBunches = useMemo(
    () => toBunches(grapes) + localBunchGain,
    [grapes, localBunchGain],
  );

  // ✅ 하이드레이션/서버 업데이트에 맞춰 filled 동기화(유저가 건드리기 전까지만)
  useEffect(() => {
    if (userTouchedRef.current) return; // 유저가 조작 시작하면 더 이상 자동 동기화 X
    setFilled(grapes % GRAPES_PER_BUNCH);
  }, [grapes]);

  // 버튼 조작시 플래그 세우기
  const touch = () => {
    userTouchedRef.current = true;
  };

  const enabled = filled >= GRAPES_PER_BUNCH;

  // 🎁 (연출) 한 송이 완성 시: 상단 +1송이, 알 UI 리셋
  const onClaim = useCallback(async () => {
    if (!enabled) return 0;
    touch();
    setLocalBunchGain((n) => n + 1);
    setFilled(0);
    return 1; // RewardChest 애니메이션용
  }, [enabled]);

  return (
    <section className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">리워드</h1>
        <div className="rounded-lg bg-white/10 px-3 py-1 text-sm">
          포도 송이: <b>{displayBunches}</b>{' '}
          <span className="opacity-70">({grapes} 알)</span>
        </div>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-2 items-start">
        {/* 진행도 */}
        <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6 flex flex-col items-center">
          <GrapeCluster filledCount={filled} size={50} />
          <div className="mt-4 text-center">
            <div className="text-lg font-semibold">{filled}/6 알 채움</div>
          </div>
        </div>
      </div>
    </section>
  );
}
