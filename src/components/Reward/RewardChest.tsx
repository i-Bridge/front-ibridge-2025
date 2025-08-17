'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CoinBurst from './CoinBurst';

type Props = {
  enabled: boolean; // 10알 채워졌을 때 true
  onClaim: () => Promise<number>; // 서버에서 코인 수령 → amount 반환
};

export default function RewardChest({ enabled, onClaim }: Props) {
  const [opened, setOpened] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [showBurst, setShowBurst] = useState(false);
  const clickable = enabled && !opened && !claiming;

  return (
    <div className="relative w-[220px] h-[180px] grid place-items-center">
      {/* 오라(글로우) */}
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

      {/* 상자 */}
      <motion.button
        type="button"
        disabled={!clickable}
        onClick={async () => {
          if (!clickable) return;
          try {
            setClaiming(true);
            const amount = await onClaim(); // 서버 호출
            setOpened(true);
            setShowBurst(true);
            // CoinBurst 끝나면 유지/숨기기 선택 가능
            setTimeout(() => setShowBurst(false), 900);
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
        {/* 뚜껑 */}
        <motion.div
          animate={opened ? { rotateX: 55, y: -18 } : { rotateX: 0, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 16 }}
          className="absolute -top-5 left-1/2 -translate-x-1/2 w-32 h-6 rounded-md bg-yellow-400 border border-amber-600 origin-bottom"
          style={{ boxShadow: 'inset 0 -6px 0 rgba(0,0,0,.15)' }}
        />
        {/* 몸통 */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-36 h-24 rounded-md bg-yellow-500 border border-amber-700" />
        {/* 잠금쇠 */}
        <div className="absolute top-7 left-1/2 -translate-x-1/2 w-6 h-8 rounded-md bg-yellow-300 border border-amber-600" />

        {/* 라벨 */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-center">
          <div className="text-sm font-semibold">
            {opened
              ? '보상 수령 완료!'
              : enabled
                ? '보상 상자 열기'
                : '10알을 채워보세요'}
          </div>
          {claiming && <div className="text-xs opacity-70 mt-1">수령 중…</div>}
        </div>

        {/* 코인 버스트 */}
        <AnimatePresence>{showBurst && <CoinBurst />}</AnimatePresence>
      </motion.button>
    </div>
  );
}
