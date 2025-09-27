'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Keyword {
  keyword: string;
  count: number;
  positiveScore: number; // 0 ~ 1
}

interface CategoryChartProps {
  categories?: Keyword[];
  childname: string;
  childId: string;
}

// count 기반 크기 계산
const sizeScale = (count: number, maxCount: number) => {
  const minR = 20;
  const maxR = 80;
  return minR + (count / maxCount) * (maxR - minR);
};

// positiveScore 기반 색상
const getColor = (score: number) => {
  const r = Math.round(0 + score * (255 - 0));
  const g = Math.round(191 + score * (165 - 191));
  const b = Math.round(255 + score * (0 - 255));
  return `rgb(${r},${g},${b})`;
};

export default function CategoryChart({
  categories: propCategories,
  childname,
  childId,
}: CategoryChartProps) {
  const [activeKeyword, setActiveKeyword] = useState<string | null>(null);
  const [fullscreenMode, setFullscreenMode] = useState(false);

  // ================
  // 고정 캔버스 크기 (픽셀)
  // ================
  const containerWidth = 600;
  const containerHeight = 400;
  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;

  // 더미 데이터
  const USE_DUMMY_DATA = true;
  const dummyCategories: Keyword[] = [
    { keyword: '친구들과 놀이터에서', count: 15, positiveScore: 0.8 },
    { keyword: '공룡', count: 10, positiveScore: 0.6 },
    { keyword: '아빠와의 갈등', count: 5, positiveScore: 0.2 },
    { keyword: '동물의 숲 게임', count: 20, positiveScore: 0.9 },
    { keyword: '힘든 숙제', count: 8, positiveScore: 0.4 },
  ];

  const categories = USE_DUMMY_DATA ? dummyCategories : propCategories || [];
  if (!categories.length) return null;
  const maxCount = Math.max(...categories.map((c) => c.count));

  // =====================
  // 배치 (나선형)
  // =====================
  const positions = (() => {
    const radii = categories.map((c) => sizeScale(c.count, maxCount));
    const pos: { x: number; y: number }[] = [];

    radii.forEach((r, i) => {
      if (i === 0) {
        pos.push({ x: centerX, y: centerY });
      } else {
        let angle = 0;
        let spiralRadius = radii[0] + r;
        let placed = false;

        while (!placed) {
          const x = centerX + Math.cos(angle) * spiralRadius;
          const y = centerY + Math.sin(angle) * spiralRadius;

          const overlap = pos.some((p, j) => {
            const d = Math.hypot(x - p.x, y - p.y);
            return d < r + radii[j] + 2;
          });

          if (
            !overlap &&
            x - r >= 0 &&
            x + r <= containerWidth &&
            y - r >= 0 &&
            y + r <= containerHeight
          ) {
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

    // ===============
    // 중앙 보정 추가
    // ===============
    const avgX = pos.reduce((sum, p) => sum + p.x, 0) / pos.length;
    const avgY = pos.reduce((sum, p) => sum + p.y, 0) / pos.length;
    const offsetX = centerX - avgX;
    const offsetY = centerY - avgY;

    return pos.map((p) => ({
      x: p.x + offsetX,
      y: p.y + offsetY,
    }));
  })();

  const handleClick = (keyword: string) => {
    if (fullscreenMode && activeKeyword === keyword) {
      setFullscreenMode(false);
      setActiveKeyword(null);
    } else {
      setActiveKeyword(keyword);
      setFullscreenMode(true);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-1">
        {childname || '아이'}의 분석 결과
      </h3>
      <p className="text-xs text-gray-400 mb-4">
        답변 15개 쌓일 때마다 업데이트 진행됩니다.
      </p>

      {/* 고정 크기 컨테이너 */}
      <div
        className="relative border"
        style={{ width: `${containerWidth}px`, height: `${containerHeight}px` }}
      >
        {categories.map((cat, idx) => {
          const radius = sizeScale(cat.count, maxCount);
          const color = getColor(cat.positiveScore);
          const { x, y } = positions[idx];
          const isActive = fullscreenMode && activeKeyword === cat.keyword;

          return (
            <motion.div
              key={cat.keyword}
              className="absolute flex flex-col items-center justify-center text-white cursor-pointer"
              style={{
                backgroundColor: color,
                zIndex: isActive ? 999 : 1,
                borderRadius: isActive ? 0 : '50%',
                display: fullscreenMode && !isActive ? 'none' : 'flex',
                padding: 4,
                boxSizing: 'border-box',
                overflowWrap: 'break-word',
                textAlign: 'center',
              }}
              whileHover={{
                scale: !fullscreenMode ? 1.2 : 1,
                zIndex: 1000,
              }}
              animate={{
                scale: fullscreenMode && isActive ? 1 : 1,
                width: isActive ? containerWidth : radius * 2,
                height: isActive ? containerHeight : radius * 2,
                left: isActive ? 0 : x - radius,
                top: isActive ? 0 : y - radius,
                borderRadius: isActive ? 0 : '50%',
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 25,
                duration: isActive ? 0.5 : 0.3,
              }}
              onClick={() => handleClick(cat.keyword)}
            >
              {isActive && (
                <button
                  className="absolute top-2 right-2 text-white text-lg font-bold"
                  onClick={() => {
                    setFullscreenMode(false);
                    setActiveKeyword(null);
                  }}
                >
                  ✕
                </button>
              )}
              <span className="text-xs font-bold break-words text-center">
                {cat.keyword}
              </span>
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
