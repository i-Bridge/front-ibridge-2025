'use client';

import { Text } from '@/ui/Text';
import { PieData } from './CategoryPieChart'; // (경로가 맞는지 확인)

interface CategoryTooltipProps {
  // [1] Recharts가 주입하는 props로 되돌립니다.
  active?: boolean;
  payload?: {
    payload: PieData; // recharts는 payload.payload로 데이터를 줍니다.
    [key: string]: unknown;
  }[];
  totalCount: number;

  // [2] 'position' prop을 삭제합니다.
}

/**
 * Recharts 커스텀 툴팁 (기본 버전)
 */
export default function CategoryTooltip({
  active,
  payload,
  totalCount,
}: CategoryTooltipProps) {
  
  // [3] Recharts가 주는 active와 payload로 툴팁을 띄웁니다.
  if (active && payload && payload.length) {
    const data = payload[0].payload as PieData;
    const percent = ((data.value / totalCount) * 100).toFixed(0);

    return (
      // [4] ✨ 핵심: 'position: fixed'와 'style'을 모두 삭제합니다.
      //     Recharts가 'portalTarget'을 기준으로 위치를 계산합니다.
      <div className="w-32 inline-flex flex-col justify-center items-center pointer-events-none">
        {/* 툴팁 본체 (기존 코드와 동일) */}
        <div className="px-3 py-2 bg-grayscale-gray90 rounded-md flex flex-col justify-start items-center gap-1 shadow-lg">
          <Text variant={'caption04'} className="text-white">
            {data.name}
          </Text>
          <Text variant={'body05'} className=" text-white/70">
            {percent}%
          </Text>
        </div>
        {/* 툴팁 꼬리 (기존 코드와 동일) */}
        <div className="w-9 px-1.5 inline-flex justify-center items-start">
          <svg
            width="24"
            height="8"
            viewBox="0 0 24 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11.2412 6.11426C11.6403 6.57943 12.3597 6.57943 12.7588 6.11426L18 0H6L11.2412 6.11426Z"
              fill="#191F28"
            />
          </svg>
        </div>
      </div>
    );
  }

  return null;
}