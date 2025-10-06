'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import CategorySubjectList from '@/components/Question/CategorySubjectList';

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
  // 점수 0~100 범위에서만 처리
  const s = Math.min(Math.max(score, 0), 100);

  // 하늘색 (135, 206, 235) → 주황색 (255, 165, 0)
  const r = Math.round(135 + (255 - 135) * (s / 100)); // 135 → 255
  const g = Math.round(206 + (165 - 206) * (s / 100)); // 206 → 165
  const b = Math.round(235 + (0 - 235) * (s / 100)); // 235 → 0

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
  const USE_DUMMY_DATA = false;
  const dummyCategories: Keyword[] = [
    { keyword: '친구들과 놀이터에서', count: 15, positiveScore: 0.8 },
    { keyword: '공룡', count: 10, positiveScore: 0.6 },
    { keyword: '아빠와의 갈등', count: 5, positiveScore: 0.2 },
    { keyword: '동물의 숲 게임', count: 20, positiveScore: 0.9 },
    { keyword: '힘든 숙제', count: 8, positiveScore: 0.4 },
  ];

  const categories = USE_DUMMY_DATA ? dummyCategories : propCategories || [];
  if (!categories.length) {
    return (
      <div>
        <h3 className="text-lg font-semibold mb-1">
          {childname || '아이'}의 분석 결과
        </h3>
        <p className="text-xs text-gray-400 mb-4">
          답변 15개 쌓일 때마다 업데이트 진행됩니다.
        </p>
        <div className="p-16 text-sm text-gray-500 border rounded">
          아직 군집화 결과가 존재하지 않습니다. <br />
          아이의 답변이 더 필요합니다.
        </div>
      </div>
    );
  }
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
              // ✅ fullscreenMode 아닐 때만 클릭 가능하게 수정
              onClick={() => {
                if (!fullscreenMode) handleClick(cat.keyword);
              }}
            >
              {isActive && (
                <div>
                  <div className="absolute inset-x-0 bottom-0 bg-white shadow-md rounded-t-lg p-4">
                    <CategorySubjectList
                      childId={childId}
                      keywords={cat.keyword}
                    />
                  </div>
                  {/* 닫기 버튼만 닫히는 동작 */}
                  <button
                    className="absolute top-2 right-2 text-red-500 text-lg font-bold"
                    onClick={(e) => {
                      e.stopPropagation(); // ✅ 이벤트 버블링 방지
                      setFullscreenMode(false);
                      setActiveKeyword(null);
                    }}
                  >
                    ✕
                  </button>
                </div>
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
