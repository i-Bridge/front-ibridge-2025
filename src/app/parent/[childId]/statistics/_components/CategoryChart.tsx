'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Keyword {
  keyword: string;
  count: number;
  positiveScore: number; // 0 ~ 1
}

interface CategoryChartProps {
  categories?: Keyword[]; // 실제 API 데이터는 여기로 전달
  childId: string;
}

// count 기반으로 원 반지름 계산 (예: 20~80px)
const sizeScale = (count: number, maxCount: number) => {
  const minR = 20;
  const maxR = 80;
  return minR + ((count / maxCount) * (maxR - minR));
};

// positiveScore 기반 색상 (0 -> 하늘, 1 -> 주황)
const getColor = (score: number) => {
  const r = Math.round(0 + score * (255 - 0));       // 0 -> 255
  const g = Math.round(191 + score * (165 - 191));   // 191 -> 165
  const b = Math.round(255 + score * (0 - 255));     // 255 -> 0
  return `rgb(${r},${g},${b})`;
};

export default function CategoryChart({ categories: propCategories, childId }: CategoryChartProps) {
  const [activeKeyword, setActiveKeyword] = useState<string | null>(null);
  const containerSize = 400;
  const center = containerSize / 2;

  // ===================
  // 더미 데이터
  // ===================
  const USE_DUMMY_DATA = true;
const dummyCategories: Keyword[] = [
    { keyword: '친구들과 놀이터에서', count: 15, positiveScore: 0.8 },
    { keyword: '공룡', count: 10, positiveScore: 0.6 },
    { keyword: '아빠와의 갈등', count: 5, positiveScore: 0.2 },
    { keyword: '동물의 숲 게임', count: 20, positiveScore: 0.9 },
    { keyword: '힘든 숙제', count: 8, positiveScore: 0.4 },
  ];

  const categories = USE_DUMMY_DATA ? dummyCategories : propCategories || [];

  if (!categories.length) return null; // 데이터 없으면 렌더링 X

  const maxCount = Math.max(...categories.map((c) => c.count));

  // ===================
  // 원 위치 계산 (나선형 배치)
  // ===================
  const positions = (() => {
    const radii = categories.map((c) => sizeScale(c.count, maxCount));
    const pos: { x: number; y: number }[] = [];

    radii.forEach((r, i) => {
      if (i === 0) {
        pos.push({ x: center, y: center });
      } else {
        let angle = 0;
        let spiralRadius = radii[0] + r; // 첫 원 중심에서 시작
        let placed = false;

        while (!placed) {
          const x = center + Math.cos(angle) * spiralRadius;
          const y = center + Math.sin(angle) * spiralRadius;

          let overlap = pos.some((p, j) => {
            const d = Math.hypot(x - p.x, y - p.y);
            return d < r + radii[j] + 2; // 2px 여유
          });

          if (!overlap) {
            pos.push({ x, y });
            placed = true;
          }

          angle += 0.1;
          if (angle > Math.PI * 2) {
            angle = 0;
            spiralRadius += 5;
          }
        }
      }
    });

    return pos;
  })();

  // ===================
  // 렌더링
  // ===================
  return (
    <div>
      <h3 className="text-lg font-semibold mb-1">분석 결과</h3>
      <p className="text-xs text-gray-400 mb-4">
        답변 15개 쌓일 때마다 업데이트 진행됩니다.
      </p>

      <div className="relative w-[400px] h-[400px]  -mt-24">
        {categories.map((cat, idx) => {
          const radius = sizeScale(cat.count, maxCount);
          const color = getColor(cat.positiveScore);
          const { x, y } = positions[idx];

          return (
            <motion.div
              key={cat.keyword}
              className="absolute flex flex-col items-center justify-center rounded-full text-white cursor-pointer"
              style={{
                width: radius * 2,
                height: radius * 2,
                backgroundColor: color,
                left: x - radius,
                top: y - radius,
                zIndex: Math.min(Math.floor(radius), 48), // 큰 원이 위
              }}
              animate={{ scale: activeKeyword === cat.keyword ? 1.2 : 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              onClick={() =>
                setActiveKeyword(activeKeyword === cat.keyword ? null : cat.keyword)
              }
            >
              <span className="text-xs font-bold text-center">{cat.keyword}</span>
              <span className="text-[10px] mt-1">
                {cat.positiveScore >= 0.7
                  ? '긍정'
                  : cat.positiveScore <= 0.3
                  ? '부정'
                  : ''}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
