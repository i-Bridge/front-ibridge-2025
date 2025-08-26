'use client';

import { motion } from 'framer-motion';

type Props = {
  filledCount: number; // 0~6
  size?: number; // 포도 지름(px)
};

const LAYOUT = [[0, 1, 2], [3, 4], [5]]; // 3-2-1

export default function GrapeCluster6({ filledCount, size = 46 }: Props) {
  const grape = (idx: number) => {
    const filled = idx < filledCount;
    return (
      <motion.div
        key={idx}
        initial={{ scale: 0.9, opacity: 0.85 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.22, delay: filled ? 0.02 * idx : 0 }}
        className="relative"
        style={{ width: size, height: size }}
      >
        <div
          className={`rounded-full w-full h-full ring-1 ${filled ? 'ring-purple-300/60' : 'ring-white/25'}`}
          style={{
            background: filled
              ? 'radial-gradient(120% 120% at 30% 30%, #B08CFF 0%, #6D28D9 65%, #4C1D95 100%)'
              : 'transparent',
          }}
          aria-label={filled ? '채워진 포도' : '비어있는 포도'}
        />
        {filled && (
          <div
            className="absolute left-1 top-1 rounded-full"
            style={{
              width: size * 0.28,
              height: size * 0.28,
              background: 'rgba(255,255,255,0.25)',
            }}
          />
        )}
      </motion.div>
    );
  };

  return (
    <div className="inline-block">
      {/* 줄기/잎 */}
      <div className="mx-auto mb-2 h-6 w-1.5 rounded-full bg-emerald-600" />
      <div className="mx-auto -mt-6 mb-1 w-6 h-6 rounded-tl-[14px] rounded-br-[14px] rotate-45 bg-emerald-500/90" />
      <div className="flex flex-col items-center gap-1.5">
        {LAYOUT.map((row, ri) => (
          <div key={ri} className="flex gap-1.5">
            {row.map((idx) => grape(idx))}
          </div>
        ))}
      </div>
    </div>
  );
}
