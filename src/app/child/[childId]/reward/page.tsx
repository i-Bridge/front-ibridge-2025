// app/child/[childId]/reward/page.tsx
'use client';

import { useState } from 'react';
import GrapeCluster from '@/components/Reward/GrapeCluster';
import RewardChest from '@/components/Reward/RewardChest';

export default function RewardPageLocalMock() {
  const [filled, setFilled] = useState(0); // 0~10
  const [coins, setCoins] = useState(0);
  const [claimedOnce, setClaimedOnce] = useState(false);

  const enabled = filled >= 10 && !claimedOnce;

  // 로컬 수령 로직 (서버 없이)
  const onClaim = async () => {
    const amount = 50; // 지급 코인 (테스트)
    setCoins((c) => c + amount);
    setClaimedOnce(true);
    setFilled(0); // 수령 후 리셋(서버 정책에 맞춰 변경)
    return amount;
  };

  return (
    <section className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">리워드 (로컬 테스트)</h1>
        <div className="rounded-lg bg-white/10 px-3 py-1">🪙 {coins}</div>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-2 items-start">
        {/* 포도 진행도 */}
        <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6 flex flex-col items-center">
          <GrapeCluster filledCount={filled} size={48} />
          <div className="mt-4 text-center">
            <div className="text-lg font-semibold">{filled}/10 알 채움</div>
          </div>

          {/* 로컬 데브 패널 */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setFilled((n) => Math.min(10, n + 1))}
              className="rounded-lg bg-white/10 px-3 py-1 text-sm hover:bg-white/15"
            >
              +1 알 채우기
            </button>
            <button
              onClick={() => setFilled((n) => Math.max(0, n - 1))}
              className="rounded-lg bg-white/10 px-3 py-1 text-sm hover:bg-white/15"
            >
              -1 알 줄이기
            </button>
            <button
              onClick={() => {
                setFilled(0);
                setClaimedOnce(false);
              }}
              className="rounded-lg bg-white/10 px-3 py-1 text-sm hover:bg-white/15"
            >
              초기화
            </button>
          </div>
        </div>

        {/* 보상 상자 */}
        <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6 flex flex-col items-center">
          <RewardChest enabled={enabled} onClaim={onClaim} />
          <div className="mt-2 text-sm">
            {enabled ? (
              <span className="text-amber-300">
                보상을 받을 수 있어요! 상자를 열어보세요.
              </span>
            ) : filled >= 10 && claimedOnce ? (
              <span className="opacity-80">
                이미 보상을 수령했어요. 다시 10알 채워보세요!
              </span>
            ) : (
              <span className="opacity-80">
                포도를 10알 채우면 상자가 나타나요.
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
