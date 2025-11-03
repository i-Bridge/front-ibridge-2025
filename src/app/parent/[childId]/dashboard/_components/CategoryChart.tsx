'use client';

import { useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  TooltipProps,
} from 'recharts';
// import SubjectPopup from './SubjectPopup'; // 1. 팝업 컴포넌트 import (오류로 인해 제거)
interface Keyword {
  keyword: string;
  count: number;
  positiveScore: number;
}
// Pie 차트 데이터 타입
interface PieData {
  name: string;
  value: number;
  // 원본 데이터를 툴팁에서 사용하기 위해 포함
  original: Keyword | { keyword: string; count: number; positiveScore: number };
}

// 컴포넌트 Props
interface CategoryRankChartProps {
  keywords: Keyword[];
}

// 1~5위 + 기타 색상
const PIE_COLORS = [
  '#38bdf8', // 1위 (sky-400)
  '#60c9f9', // 2위
  '#89d6fa', // 3위
  '#b2e2fb', // 4위
  '#d8eefd', // 5위
  '#f1f5f9', // 6. 기타 (gray-100)
];

/**
 * Recharts 커스텀 툴팁
 */
const CustomTooltip = ({
  active,
  payload,
  ...props
}: TooltipProps<number, string> & { totalCount: number }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as PieData;
    const percent = ((data.value / props.totalCount) * 100).toFixed(0);

    return (
      <div className="w-32 inline-flex flex-col justify-center items-center">
        <div className="px-3 py-2 bg-Grayscale-gray90 rounded-md flex flex-col justify-start items-center gap-1 shadow-lg">
          <div className="justify-center text-Grayscale-white text-sm font-extrabold font-['Tmoney_RoundWind'] leading-5">
            {data.name}
          </div>
          <div className="justify-center text-white/70 text-sm font-normal font-['Tmoney_RoundWind'] leading-6">
            {percent}%
          </div>
        </div>
        {/* 툴팁 꼬리 */}
        <div className="w-9 px-1.5 inline-flex justify-center items-start">
          <svg
            width="12"
            height="8"
            viewBox="0 0 12 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 8L0 0L12 1.19209e-06L6 8Z"
              fill={
                '#1f2937' /* bg-Grayscale-gray90 (gray-800) */
              }
            />
          </svg>
        </div>
      </div>
    );
  }

  return null;
};

// ------------------------------------------------------------------
// 2. SubjectPopup 컴포넌트를 파일 내부로 이동
// ------------------------------------------------------------------
interface SubjectPopupProps {
  keyword: string;
  onClose: () => void;
}

/**
 * 팝업 컴포넌트 (Placeholder)
 * 'N개의 대화' 클릭 시 보일 팝업입니다.
 */
function SubjectPopup({ keyword, onClose }: SubjectPopupProps) {
  return (
    // 전체 화면 오버레이
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center"
      onClick={onClose} // 배경 클릭 시 닫기
    >
      {/* 팝업 컨텐츠 */}
      <div
        className="bg-Grayscale-white p-8 rounded-[20px] z-50 w-[90%] max-w-[400px]"
        onClick={(e) => e.stopPropagation()} // 팝업 내부 클릭 시 닫히지 않게
      >
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-Grayscale-gray90 text-xl font-extrabold font-['Tmoney_RoundWind'] leading-7">
            {keyword}
          </h2>
          <button
            onClick={onClose}
            className="text-Grayscale-gray50 text-3xl font-light leading-none hover:text-Grayscale-gray90"
          >
            &times;
          </button>
        </div>
        {/* 본문 (Placeholder) */}
        <div className="text-Grayscale-gray80 font-['Tmoney_RoundWind'] h-48 overflow-y-auto">
          {keyword} 
          <br />
          (컴포넌트 구현 필요)
        </div>
      </div>
    </div>
  );
}
// ------------------------------------------------------------------

/**
 * 카테고리 랭킹 아이템 (오른쪽 리스트)
 */
const CategoryRankItem = ({
  keyword,
  rank,
  onClick,
}: {
  keyword: Keyword;
  rank: number;
  onClick: () => void;
}) => {
  const isPositive = keyword.positiveScore >= 50;
  const sentimentPercent = isPositive
    ? keyword.positiveScore
    : 100 - keyword.positiveScore;

  const sentimentLabel = isPositive ? '긍정' : '부정';
  const sentimentBgClass = isPositive
    ? 'bg-Success-successLight'
    : 'bg-Error-errorLight';
  const sentimentTextClass = isPositive
    ? 'text-Success-success'
    : 'text-Error-error';

  // 1~5위는 진한 회색, 6위부터는 연한 회색
  const rankBgClass =
    rank <= 5 ? 'bg-Grayscale-gray80' : 'bg-Grayscale-gray10';
  const rankTextClass =
    rank <= 5 ? 'text-Grayscale-white' : 'text-Grayscale-gray80';

  return (
    <div className="self-stretch py-3 inline-flex justify-start items-center gap-3">
      <div className="flex-1 flex justify-start items-center gap-3">
        {/* Rank Circle */}
        <div
          className={`w-6 h-6 p-2 rounded-[99px] inline-flex flex-col justify-center items-center gap-2 ${rankBgClass}`}
        >
          <div className="inline-flex justify-start items-start gap-1">
            <div className="w-auto min-w-[8px] text-center pt-0.5 inline-flex flex-col justify-center items-center gap-2.5">
              <div
                className={`self-stretch justify-start text-sm font-extrabold font-['Tmoney_RoundWind'] leading-5 ${rankTextClass}`}
              >
                {rank}
              </div>
            </div>
          </div>
        </div>

        {/* Keyword & Sentiment */}
        <div className="flex justify-start items-center gap-3">
          <div className="justify-start text-Grayscale-gray90 text-lg font-normal font-['Tmoney_RoundWind'] leading-7">
            {keyword.keyword}
          </div>
          <div
            className={`px-2 py-1.5 rounded-md flex justify-start items-start gap-1 ${sentimentBgClass}`}
          >
            <div
              className={`justify-center text-sm font-extrabold font-['Tmoney_RoundWind'] leading-5 ${sentimentTextClass}`}
            >
              {sentimentLabel} {sentimentPercent.toFixed(0)}%
            </div>
          </div>
        </div>
      </div>

      {/* Count Button */}
      <button
        // onClick={onClick} -- 팝업 기능 임시 비활성화
        className="flex justify-start items-center gap-1 cursor-pointer hover:opacity-70 transition-opacity"
      >
        <div className="justify-start text-Grayscale-gray50 text-lg font-normal font-['Tmoney_RoundWind'] leading-7">
          {keyword.count}개의 대화
        </div>
        {/* --- 수정된 아이콘 --- */}
        <div className="w-6 h-6 flex justify-center items-center">
          <svg
            width="8"
            height="12"
            viewBox="0 0 8 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1L7 6L1 11"
              stroke="#A6A6A6" // Grayscale-gray50 (figma에는 gray-50이 #A6A6A6)
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        {/* --- 수정된 아이콘 끝 --- */}
      </button>
    </div>
  );
};

/**
 * 메인 카테고리 순위 차트 컴포넌트
 */
export default function CategoryRankChart({
  keywords,
}: CategoryRankChartProps) {
  // const [isPopupOpen, setIsPopupOpen] = useState(false);
  // const [selectedKeyword, setSelectedKeyword] = useState<Keyword | null>(null);

  // --- 데이터 가공 ---
  const totalCount = keywords.reduce((sum, k) => sum + k.count, 0);

  // 긍정/부정 카테고리 개수 (차트 중앙)
  const totalPositive = keywords.filter(
    (k) => k.positiveScore >= 50,
  ).length;
  const totalNegative = keywords.length - totalPositive;

  // 파이 차트 데이터: 1~5위 + 기타
  const top5Keywords = keywords.slice(0, 5);
  const otherKeywords = keywords.slice(5);
  const otherCount = otherKeywords.reduce((sum, k) => sum + k.count, 0);

  const pieData: PieData[] = top5Keywords.map((k) => ({
    name: k.keyword,
    value: k.count,
    original: k,
  }));

  if (otherCount > 0) {
    pieData.push({
      name: '기타',
      value: otherCount,
      original: {
        keyword: '기타',
        count: otherCount,
        positiveScore: -1, // '기타'는 긍/부정 없음
      },
    });
  }
  // --- 데이터 가공 끝 ---

  // const handleOpenPopup = (keyword: Keyword) => {
  //   setSelectedKeyword(keyword);
  //   setIsPopupOpen(true);
  // };

  // const handleClosePopup = () => {
  //   setIsPopupOpen(false);
  //   setSelectedKeyword(null);
  // };

  return (
    <>
      <div className="w-full max-w-[960px] px-10 py-8 bg-Grayscale-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-Grayscale-gray20 inline-flex flex-col justify-center items-start gap-10">
        {/* Title */}
        <div className="inline-flex justify-start items-center gap-2">
          <div className="justify-start text-Grayscale-gray90 text-xl font-extrabold font-['Tmoney_RoundWind'] leading-7">
            카테고리 순위
          </div>
        </div>

        {/* Chart & List */}
        <div className="self-stretch inline-flex justify-start items-center gap-20">
          {/* Pie Chart */}
          <div className="w-60 h-60 relative flex justify-center items-center gap-2.5">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120} // w-60 / 2
                  innerRadius={80} // 도넛 차트
                  paddingAngle={1}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={<CustomTooltip totalCount={totalCount} />}
                  cursor={{ fill: 'transparent' }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Text */}
            <div className="left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 absolute inline-flex flex-col justify-start items-start gap-[3px]">
              <div className="self-stretch inline-flex justify-start items-start gap-1">
                <div className="justify-start text-Grayscale-gray90 text-sm font-extrabold font-['Tmoney_RoundWind'] leading-5">
                  긍정
                </div>
                <div className="justify-start text-Grayscale-gray90 text-sm font-extrabold font-['Tmoney_RoundWind'] leading-5">
                  {totalPositive}
                </div>
              </div>
              <div className="self-stretch inline-flex justify-start items-start gap-1">
                <div className="justify-start text-Grayscale-gray90 text-sm font-extrabold font-['Tmoney_RoundWind'] leading-5">
                  부정
                </div>
                <div className="justify-start text-Grayscale-gray90 text-sm font-extrabold font-['Tmoney_RoundWind'] leading-5">
                  {totalNegative}
                </div>
              </div>
            </div>
          </div>

          {/* Rank List */}
          <div className="flex-1 inline-flex flex-col justify-start items-start">
            {keywords.map((keyword, index) => (
              <CategoryRankItem
                key={keyword.keyword}
                keyword={keyword}
                rank={index + 1}
                onClick={() => {
                  console.log('Popup feature temporarily disabled');
                }} // 팝업 기능 임시 비활성화
                // onClick={() => handleOpenPopup(keyword)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Popup Modal -- 팝업 기능 임시 비활성화
      {isPopupOpen && selectedKeyword && (
        <SubjectPopup keyword={selectedKeyword} onClose={handleClosePopup} />
      )}
      */}
    </>
  );
}


