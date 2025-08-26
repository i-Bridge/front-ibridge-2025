// components/reward/RewardChest.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CoinBurst from './CoinBurst';

type Props = {
  enabled: boolean; // 6알 채웠을 때 true
  onClaim: () => Promise<number>; // 수령 → 송이 개수(amount) 반환 (보통 1)
};

export default function RewardChest({ enabled, onClaim }: Props) {
  const [opened, setOpened] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [showBurst, setShowBurst] = useState(false);
  const clickable = enabled && !opened && !claiming;

  return (
    <div className="relative w-[220px] h-[180px] grid place-items-center">
      <AnimatePresence>
        {enabled && !opened && (
          <motion.div
            key="glow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 blur-2xl rounded-3xl"
            style={{
              background:
                'radial-gradient(circle, rgba(250,204,21,.5), transparent 60%)',
            }}
          />
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        disabled={!clickable}
        onClick={async () => {
          if (!clickable) return;
          try {
            setClaiming(true);
            const amount = await onClaim();
            if (amount > 0) {
              setOpened(true);
              setShowBurst(true); // 코인 이펙트 재활용(황금빛 파티클)
              setTimeout(() => setShowBurst(false), 900);
            }
          } finally {
            setClaiming(false);
          }
        }}
        whileHover={clickable ? { scale: 1.04 } : undefined}
        whileTap={clickable ? { scale: 0.98 } : undefined}
        className={`relative w-40 h-28 rounded-xl border-2 transition
          ${opened ? 'border-amber-400' : enabled ? 'border-yellow-300' : 'border-white/20 cursor-not-allowed'}`}
        style={{
          background: opened
            ? 'linear-gradient(180deg, #FBBF24 0%, #D97706 100%)'
            : 'linear-gradient(180deg, #6B7280 0%, #374151 100%)',
          boxShadow:
            enabled && !opened ? '0 0 20px rgba(250,204,21,.5)' : undefined,
        }}
      >
        {/* 뚜껑/몸통/자물쇠 생략: 이전과 동일 */}
        <motion.div
          animate={opened ? { rotateX: 55, y: -18 } : { rotateX: 0, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 16 }}
          className="absolute -top-5 left-1/2 -translate-x-1/2 w-32 h-6 rounded-md bg-yellow-400 border border-amber-600 origin-bottom"
          style={{ boxShadow: 'inset 0 -6px 0 rgba(0,0,0,.15)' }}
        />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-36 h-24 rounded-md bg-yellow-500 border border-amber-700" />
        <div className="absolute top-7 left-1/2 -translate-x-1/2 w-6 h-8 rounded-md bg-yellow-300 border border-amber-600" />

        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-center">
          <div className="text-sm font-semibold">
            {opened
              ? '🍇 한 송이 획득!'
              : enabled
                ? '보상 상자 열기'
                : '6알을 채워보세요'}
          </div>
          {claiming && <div className="text-xs opacity-70 mt-1">수령 중…</div>}
        </div>

        <AnimatePresence>{showBurst && <CoinBurst />}</AnimatePresence>
      </motion.button>
    </div>
  );
}
