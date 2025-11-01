'use client';

import { useState, useEffect } from 'react';
import { Fetcher } from '@/lib/fetcher'; // Fetcher 경로는 실제 프로젝트에 맞게 수정하세요.
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

// cn 유틸리티 함수 (tailwind-merge와 clsx 결합)
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- 타입 정의 ---
interface CumulateAPI {
  cumList: number[];
}

interface CumulateChartProps {
  childId: string;
  cumulative: number;
  defaultCumList: number[];
}

type PeriodType = 'day' | 'week' | 'month';

// 기간 선택 버튼 옵션
const periodOptions: { key: PeriodType; label: string }[] = [
  { key: 'day', label: '일간' },
  { key: 'week', label: '주간' },
  { key: 'month', label: '월간' },
];

// Y축 레이블 (피그마 디자인 기준: 9부터 0까지)
const yAxisLabels = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
// 차트의 최대값 (Y축 기준)
const MAX_CHART_VALUE = Math.max(...yAxisLabels);

export default function CumulateChart({ childId, cumulative, defaultCumList }: CumulateChartProps) {
  const [periodType, setPeriodType] = useState<PeriodType>('day');
  const [cumList, setCumList] = useState<number[]>(defaultCumList);

  // --- 데이터 페칭 ---
  useEffect(() => {
    async function fetchCumulateData() {
      try {
        const cumulateRes = await Fetcher<CumulateAPI>(
          `/parent/${childId}/stat/cumulative?periodType=${periodType}`
        );
        // API 응답이 7개 미만일 경우, 0으로 채워서 7개를 맞춥니다.
        const data = cumulateRes.data?.cumList ?? [];
        const paddedData = [...Array(7 - data.length).fill(0), ...data];
        setCumList(paddedData.slice(-7)); // 항상 7개의 데이터만 유지
      } catch (err) {
        console.error(err);
        setCumList(Array(7).fill(0)); // 에러 발생 시 0으로 초기화
      }
    }

    fetchCumulateData();
  }, [periodType, childId]);

  // --- X축 레이블 생성 ---
  // API가 항상 7개의 데이터를 반환한다고 가정 (오래된 순 -> 최신 순)
  const generateLabels = () => {
    const labels: string[] = [];
    const units = { day: '일', week: '주', month: '달' };
    const unit = units[periodType];
    const lastLabel = { day: '오늘', week: '이번 주', month: '이번 달' };

    for (let i = 6; i > 0; i--) { // 6, 5, 4, 3, 2, 1
      labels.push(`${i}${unit} 전`);
    }
    labels.push(lastLabel[periodType]); // 오늘, 이번 주, 이번 달
    return labels; // ["6일 전", "5일 전", ..., "오늘"]
  };

  const labels = generateLabels();

  return (
    // 1. 최상위 프레임 (Figma 코드 기반)
    <div className="self-stretch h-[520px] p-10 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-gray-200 flex flex-col justify-center items-start gap-7 bg-white font-['Tmoney_RoundWind']">
      
      {/* 2. 헤더: 타이틀 + 기간 선택 버튼 */}
      <div className="self-stretch inline-flex justify-between items-center">
        {/* 타이틀 */}
        <div className="flex justify-start items-center gap-2">
          <div className="text-gray-900 text-xl font-extrabold leading-7">누적 답변 개수</div>
          {/* API에서 받은 최신 데이터(오늘)를 표시합니다. */}
          <div className="text-blue-600 text-xl font-extrabold leading-7">
            {cumulative}
          </div>
        </div>
        
        {/* 기간 선택 버튼 */}
        <div className="p-1 bg-gray-100 rounded-lg flex justify-start items-end gap-1">
          {periodOptions.map((option) => (
            <button
              key={option.key}
              onClick={() => setPeriodType(option.key)}
              // cn 유틸리티로 조건부 스타일링
              className={cn(
                'h-8 px-3 rounded-lg flex justify-center items-center gap-2.5 text-sm font-extrabold leading-5 transition-colors',
                periodType === option.key
                  ? 'bg-white text-gray-800 shadow-sm' // 활성 상태
                  : 'bg-transparent text-gray-500 hover:bg-gray-200' // 비활성 상태
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. 차트 본문 */}
      <div className="self-stretch flex-1 inline-flex justify-start items-start gap-1.5 h-[320px]">
        
        {/* Y축 레이블 */}
        {/* pb-5 대신 flex-col을 늘려서 0이 가장 아래에 오도록 조정 */}
        <div className="self-stretch flex flex-col justify-between items-end pr-2 h-full pb-5"> 
          {yAxisLabels.map((label) => (
            <div key={label} className="text-right text-gray-600 text-sm font-normal leading-6">
              {label}
            </div>
          ))}
        </div>

        {/* 차트 영역 (Grid + Bars) */}
        <div className="flex-1 self-stretch relative flex justify-around items-start">
          
          {/* Grid Lines (배경) */}
          <div className="w-full h-full pt-2 absolute left-0 top-0 flex flex-col justify-between">
            {/* yAxisLabels.slice(0, -1)로 마지막 0 라벨의 점선을 제거 */}
            {yAxisLabels.slice(0, -1).map((_, index) => (
              <div key={index} className="self-stretch border-b border-dashed border-gray-200" />
            ))}
          </div>

          {/* Bars (데이터) */}
          {labels.map((label, index) => {
            const value = cumList[index] || 0;
            // 높이 계산: (현재값 / 최대값) * 100%
            // 0일 때도 최소한의 높이를 주어 X축 레이블이 잘리지 않도록 조정 가능 (선택 사항)
            const barHeight = (value / MAX_CHART_VALUE) * 100;

            return (
              <div
                key={label}
                className="flex-1 self-stretch px-4 flex flex-col justify-end items-center relative group z-10"
              >
                {/* 툴팁 (Figma SVG 활용) - group-hover로 제어 */}
                {/* 툴팁 위치 조정을 위해 top: -(높이+꼬리+패딩) 값을 사용 */}
                <div 
                    className="absolute hidden group-hover:flex flex-col items-center pointer-events-none"
                    style={{ bottom: `${barHeight}%`, marginBottom: '16px' }} // 막대 높이에 따라 bottom 조정 + 꼬리 높이 + 약간의 여백
                >
                  {/* 툴팁 박스 + 텍스트 */}
                  <div className="relative flex items-center justify-center">
                    {/* 검은색 박스 SVG */}
                    <svg width="39" height="33" viewBox="0 0 39 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 6C0 2.68629 2.68629 0 6 0H33C36.3137 0 39 2.68629 39 6V27C39 30.3137 36.3137 33 33 33H6C2.68629 33 0 30.3137 0 27V6Z" fill="#191F28"/>
                    </svg>
                    {/* 텍스트 (SVG 내부 텍스트 대신 HTML 텍스트 사용) */}
                    <span className="absolute text-white text-sm font-extrabold">
                      {value}
                    </span>
                  </div>
                  {/* 툴팁 꼬리 (image_eedde0.png 참고) */}
                  {/* 꼬리 SVG는 4px 높이 */}
                  <svg width="8" height="4" viewBox="0 0 8 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4L0 0H8L4 4Z" fill="#191F28"/>
                  </svg>
                </div>

                {/* 막대 (Figma SVG 대신 div로 구현) */}
                <div
                  className="w-full bg-[#FFDE72] rounded-t-lg transition-all duration-300"
                  style={{ height: `${barHeight}%` }}
                >
                  {/* 피그마 SVG는 크기가 고정되어 동적 높이 조절이 어렵습니다. */}
                  {/* 동일한 디자인의 div (bg-yellow, rounded-t-lg)로 대체하는 것이 훨씬 효율적입니다. */}
                </div>

                {/* X축 레이블 */}
                <div className="self-stretch pt-3">
                  <div className="flex-1 text-center text-gray-500 text-sm font-extrabold leading-5">
                    {label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}