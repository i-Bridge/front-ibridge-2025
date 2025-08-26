'use client';

import { useState } from 'react';
import GrapeCluster from './_components/GrapeCluster';
import RewardChest from './_components/RewardChest';
import { useGameStore } from '@/store/useGameStore';

export default function RewardPageLocalMock() {
  const [filled, setFilled] = useState(0); // 0~6
  const [claimedOnce, setClaimedOnce] = useState(false);
  const grapeBunches = useGameStore((s) => s.grapeBunches);
  const addBunches = useGameStore((s) => s.addBunches);

  const enabled = filled >= 6 && !claimedOnce;

  const onClaim = async () => {
    // 보상: 포도 송이 1개
    addBunches(1);
    setClaimedOnce(true);
    setFilled(0); // 다음 라운드 준비
    return 1; // 받은 송이 수 반환
  };

  return (
    <section className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">리워드</h1>
        <div className="rounded-lg bg-white/10 px-3 py-1 text-sm">
          포도 송이: <b>{grapeBunches}</b>
        </div>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-2 items-start">
        {/* 진행도 */}
        <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6 flex flex-col items-center">
          <GrapeCluster filledCount={filled} size={50} />
          <div className="mt-4 text-center">
            <div className="text-lg font-semibold">{filled}/6 알 채움</div>
          </div>

          {/* 로컬 테스트 버튼 */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setFilled((n) => Math.min(6, n + 1))}
              className="rounded-lg bg-white/10 px-3 py-1 text-sm hover:bg-white/15"
            >
              +1 알
            </button>
            <button
              onClick={() => setFilled((n) => Math.max(0, n - 1))}
              className="rounded-lg bg-white/10 px-3 py-1 text-sm hover:bg-white/15"
            >
              -1 알
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
            ) : filled >= 6 && claimedOnce ? (
              <span className="opacity-80">
                이미 수령했어요. 다시 6알을 채워보세요!
              </span>
            ) : (
              <span className="opacity-80">
                포도를 6알 채우면 상자가 나타나요.
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
