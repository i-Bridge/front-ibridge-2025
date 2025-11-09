// app/parent/[childId]/dashboard/_components/DynamicCategoryChart.tsx

'use client'; // 👈 이 파일은 클라이언트 컴포넌트여야 합니다.

import dynamic from 'next/dynamic';
// 1번 단계에서 export한 타입을 import 합니다.
import type { CategoryRankChartProps } from './CategoryChart';

// 'recharts' 오류를 해결하기 위해 'dynamic' import를 이 파일에서 수행합니다.
const DynamicChart = dynamic(
  () => import('./CategoryChart'), // 실제 차트 컴포넌트
  {
    ssr: false, // 👈 'use client' 파일 안에서는 ssr: false 사용 가능
    
    // 로딩 스켈레톤 UI
    loading: () => (
      <div className="w-full max-w-[960px] px-10 py-8 bg-Grayscale-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-Grayscale-gray20 h-[368px]">
        {/* Title Skeleton */}
        <div className="h-7 w-32 bg-Grayscale-gray10 rounded-md animate-pulse" />
        
        <div className="self-stretch flex justify-start items-center gap-20 mt-10">
          {/* Chart Skeleton */}
          <div className="w-60 h-60 rounded-full bg-Grayscale-gray10 animate-pulse" />
          
          {/* List Skeleton */}
          <div className="flex-1 flex flex-col gap-3">
            <div className="h-10 w-full bg-Grayscale-gray10 rounded-md animate-pulse" />
            <div className="h-10 w-full bg-Grayscale-gray10 rounded-md animate-pulse" />
            <div className="h-10 w-full bg-Grayscale-gray10 rounded-md animate-pulse" />
            <div className="h-10 w-full bg-Grayscale-gray10 rounded-md animate-pulse" />
            <div className="h-10 w-full bg-Grayscale-gray10 rounded-md animate-pulse" />
          </div>
        </div>
      </div>
    ),
  },
);

// 부모(page.tsx)로부터 props를 받아 DynamicChart에 그대로 전달합니다.
export default function DynamicCategoryChart(props: CategoryRankChartProps) {
  return <DynamicChart {...props} />;
}