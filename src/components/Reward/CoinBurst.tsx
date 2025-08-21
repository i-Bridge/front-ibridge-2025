'use client';

import { motion } from 'framer-motion';

export default function CoinBurst({ onComplete }: { onComplete?: () => void }) {
  // 10~12개 포도 송이 파티클
  const bunches = Array.from({ length: 12 });

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      {bunches.map((_, i) => {
        const angle = (i / bunches.length) * Math.PI * 2;
        const radius = 100 + Math.random() * 40; // 퍼지는 반경
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius * 0.8; // 살짝 타원
        const dur = 0.7 + Math.random() * 0.2;

        return (
          <motion.div
            key={i}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.7, rotate: 0 }}
            animate={{ x, y, opacity: 0, scale: 1, rotate: 35 }}
            transition={{ duration: dur, ease: 'easeOut' }}
            onAnimationComplete={
              i === bunches.length - 1 ? onComplete : undefined
            }
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <MiniGrapeBunch size={28} />
          </motion.div>
        );
      })}
    </div>
  );
}

/**
 * 작은 포도 송이 아이콘 (3-2-1 배열)
 * size: 전체 아이콘의 대략적인 높이(px)
 */
function MiniGrapeBunch({ size = 28 }: { size?: number }) {
  const unit = size / 6; // 알 지름 스케일 기준
  const grapeStyle = {
    background:
      'radial-gradient(120% 120% at 30% 30%, #C4B5FD 0%, #7C3AED 60%, #4C1D95 100%)',
    boxShadow: '0 0 6px rgba(147, 51, 234, .45)',
  } as const;

  return (
    <div
      className="relative"
      style={{
        width: unit * 6,
        height: unit * 6,
        filter: 'drop-shadow(0 2px 6px rgba(76,29,149,.35))',
      }}
    >
      {/* 잎/줄기 */}
      <div
        className="absolute rounded-[4px]"
        style={{
          width: unit * 1.6,
          height: unit * 1.6,
          left: unit * 2.1,
          top: -unit * 0.4,
          transform: 'rotate(45deg)',
          background: 'linear-gradient(135deg, #34D399 0%, #059669 100%)',
          boxShadow: '0 0 4px rgba(5,150,105,.4)',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: unit * 0.45,
          height: unit * 2.4,
          left: unit * 2.8,
          top: -unit * 0.5,
          background: '#065F46',
        }}
      />

      {/* 포도 알 3-2-1 */}
      {/* 위 3개 */}
      <GrapeDot
        x={unit * 0.6}
        y={unit * 1.4}
        d={unit * 1.6}
        style={grapeStyle}
      />
      <GrapeDot
        x={unit * 2.2}
        y={unit * 1.2}
        d={unit * 1.6}
        style={grapeStyle}
      />
      <GrapeDot
        x={unit * 3.8}
        y={unit * 1.4}
        d={unit * 1.6}
        style={grapeStyle}
      />
      {/* 중간 2개 */}
      <GrapeDot
        x={unit * 1.4}
        y={unit * 2.8}
        d={unit * 1.7}
        style={grapeStyle}
      />
      <GrapeDot
        x={unit * 3.0}
        y={unit * 2.8}
        d={unit * 1.7}
        style={grapeStyle}
      />
      {/* 아래 1개 */}
      <GrapeDot
        x={unit * 2.2}
        y={unit * 4.1}
        d={unit * 1.9}
        style={grapeStyle}
      />
    </div>
  );
}

function GrapeDot({
  x,
  y,
  d,
  style,
}: {
  x: number;
  y: number;
  d: number;
  style: React.CSSProperties;
}) {
  return (
    <div
      className="absolute rounded-full ring-1"
      style={{
        left: x,
        top: y,
        width: d,
        height: d,
        ...style,
        borderColor: 'rgba(196,181,253,.6)', // ring color
      }}
    >
      {/* 하이라이트 */}
      <div
        className="absolute rounded-full"
        style={{
          left: d * 0.18,
          top: d * 0.18,
          width: d * 0.35,
          height: d * 0.35,
          background: 'rgba(255,255,255,.25)',
        }}
      />
    </div>
  );
}
