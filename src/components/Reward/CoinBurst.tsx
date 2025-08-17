'use client';

import { motion } from 'framer-motion';

export default function CoinBurst({ onComplete }: { onComplete?: () => void }) {
  // 10~12개 정도 파티클
  const coins = Array.from({ length: 12 });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      {coins.map((_, i) => {
        const angle = (i / coins.length) * Math.PI * 2;
        const radius = 100 + Math.random() * 40; // 퍼지는 반경
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius * 0.8; // 살짝 타원
        const dur = 0.7 + Math.random() * 0.2;

        return (
          <motion.div
            key={i}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.6, rotate: 0 }}
            animate={{ x, y, opacity: 0, scale: 1, rotate: 90 }}
            transition={{ duration: dur, ease: 'easeOut' }}
            onAnimationComplete={
              i === coins.length - 1 ? onComplete : undefined
            }
            className="absolute left-1/2 top-1/2 -ml-3 -mt-3 w-6 h-6 rounded-full ring-1 ring-yellow-300"
            style={{
              background:
                'radial-gradient(100% 100% at 30% 30%, #FFF59D 0%, #F59E0B 70%, #B45309 100%)',
              boxShadow: '0 0 10px rgba(245, 158, 11, .6)',
            }}
          />
        );
      })}
    </div>
  );
}
