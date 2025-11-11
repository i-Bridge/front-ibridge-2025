'use client';

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip, // [1] Recharts의 Tooltip을 다시 import 합니다.
} from 'recharts';
import CategoryTooltip from './CategoryToolTip'; // [2] 커스텀 툴팁을 import 합니다.
import { Text } from '@/ui/Text';
// [3] useState와 useEffect를 import 합니다. (portalTarget용)
import { useState, useEffect } from 'react';

const PIE_COLORS = [
  '#51C2FF', // 1위 (sky-400)
  '#51C2FFCC', // 2위
  '#51C2FF99', // 3위
  '#51C2FF66', // 4위
  '#51C2FF33', // 5위
  '#51C2FF11', // 6. 기타 (gray-100)
];

export interface Keyword {
  category: string;
  count: number;
  positiveScore: number;
}
export interface PieData {
  name: string;
  value: number;
  original: Keyword | { category: string; count: number; positiveScore: number };
  [key: string]: unknown;
}

interface CategoryPieChartProps {
  pieData: PieData[];
  totalCount: number;
  totalPositive: number;
  totalNegative: number;
}
export default function CategoryPieChart({
  pieData,
  totalCount,
  totalPositive,
  totalNegative,
}: CategoryPieChartProps) {
  
  // [4] 툴팁을 렌더링할 'portal' 대상을 state로 관리합니다.
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  // [5] 클라이언트에서 마운트된 후에 document.body를 state에 설정합니다.
  useEffect(() => {
    setPortalTarget(document.body);
  }, []);

  // [6] 마우스를 따라다니게 만들었던
  //     모든 state와 핸들러 함수를 깨끗하게 삭제합니다.
  // const [hoveredData, setHoveredData] = useState(...);
  // const [mousePosition, setMousePosition] = useState(...);
  // const handleMouseEnter = (...) => {...};
  // const handleMouseLeave = () => {...};

  return (
    <div className="w-60 h-60 relative flex justify-center items-center gap-2.5">
      <ResponsiveContainer width="100%" height="100%">
        {/* [7] PieChart에서 모든 onMouse... 이벤트를 삭제합니다. */}
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            innerRadius={50}
            paddingAngle={0}
            isAnimationActive={false}
            // [8] Pie에서 모든 onMouse... 이벤트를 삭제합니다.
          >
            {pieData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={PIE_COLORS[index % PIE_COLORS.length]}
                stroke="none"
              />
            ))}
          </Pie>

          {/* [9] ✨ Recharts의 기본 <Tooltip>을 사용합니다. */}
          {/* portalTarget이 준비되었을 때만 툴팁을 렌더링합니다. */}
          {portalTarget && (
            <Tooltip
              // 1. (✨ 핵심) 커스텀 툴팁을 'content' prop으로 연결
              content={<CategoryTooltip totalCount={totalCount} />}
              
              // 2. 회색 사각형 커서 숨김
              cursor={false}

              // 3. (✨ 위치 문제 해결) 
              // 툴팁을 부모의 CSS 맥락(transform)에서 분리하여
              // document.body에 직접 렌더링합니다.
              
              // 4. 애니메이션 비활성화 (빠른 반응)
              isAnimationActive={false}
              
              // 5. 팝업(z-50)이나 다른 요소보다 위에 뜨도록
              wrapperStyle={{ zIndex: 999 }}
            />
          )}
        </PieChart>
      </ResponsiveContainer>

      {/* [10] "긍정/부정" 텍스트 (요청대로 중앙에 유지) */}
      <div className="left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 absolute inline-flex flex-col justify-start items-start gap-[3px] pointer-events-none">
        <div className="self-stretch inline-flex justify-start items-start gap-1">
          <Text variant={'caption04'} className="justify-start">
            긍정
          </Text>
          <Text variant={'caption04'} className="justify-start">
            {totalPositive}
          </Text>
        </div>
        <div className="self-stretch inline-flex justify-start items-start gap-1">
          <Text variant={'caption04'} className="justify-start">
            부정
          </Text>
          <Text variant={'caption04'} className="justify-start">
            {totalNegative}
          </Text>
        </div>
      </div>

      {/* [11] 수동 툴팁 <CategoryTooltip ... /> 을 삭제합니다. */}
    </div>
  );
}