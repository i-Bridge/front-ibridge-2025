'use client';

import { Text } from '@/ui/Text';

// 1. useState import 제거 (현재 사용되지 않음)
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip, // 타입도 가져옵니다.
} from './ClientRecharts';

// --- 타입 정의 ---
export interface Keyword {
  keyword: string;
  count: number;
  positiveScore: number;
}

interface PieData {
  name: string;
  value: number;
  original: Keyword | { keyword: string; count: number; positiveScore: number };
  [key: string]: unknown;
}

export interface CategoryRankChartProps {
  keywords: Keyword[];
}

// --- 상수 ---
const PIE_COLORS = [
  '#51C2FF', // 1위 (sky-400)
  '#51C2FFCC', // 2위
  '#51C2FF99', // 3위
  '#51C2FF66', // 4위
  '#51C2FF33', // 5위
  '#FFFFFF', // 6. 기타 (gray-100)
];

interface RechartsPayloadItem {
  payload: PieData;
}
interface MyCustomTooltipProps {
  active?: boolean;
  payload?: RechartsPayloadItem[];
  totalCount: number;
}

// ==================================================================
// 헬퍼 컴포넌트 (Helper Components)
// ==================================================================

/**
 * Recharts 커스텀 툴팁
 */
const CustomTooltip = ({
  active,
  payload,
  totalCount, // [수정 2] props를 이 타입으로 구조 분해합니다.
}: MyCustomTooltipProps) => {
  if (active && payload && payload.length) {
    // [수정 3] payload[0].payload가 PieData 타입임을 보장받습니다.
    const data = payload[0].payload;
    const percent = ((data.value / totalCount) * 100).toFixed(0);

    return (
      <div className="w-32 inline-flex flex-col justify-center items-center">
        <div className="px-3 py-2 bg-Grayscale-gray90 rounded-md flex flex-col justify-start items-center gap-1 shadow-lg">
          <Text variant={'caption04'} className="text-white">
            {data.name}
          </Text>
          <Text variant={'body05'} className=" text-white/70">
            {percent}%
          </Text>
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

/**
 * 2. SubjectPopup 컴포넌트 (주석 처리됨)
 */
// interface SubjectPopupProps {
//   keyword: string;
//   onClose: () => void;
// }

// function SubjectPopup({ keyword, onClose }: SubjectPopupProps) {
//   return (
//     // ... (팝업 구현 코드)
//   );
// }

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
    ? 'bg-success-successLight'
    : 'bg-error-errorLight';
  const sentimentTextClass = isPositive
    ? 'text-success-success'
    : 'text-error-error';

  const rankBgClass =
    rank <= 5 ? 'bg-grayscale-gray80' : 'bg-grayscale-gray10';
  const rankTextClass =
    rank <= 5 ? 'text-grayscale-white' : 'text-grayscale-gray80';

  return (
    <div className="self-stretch py-3 inline-flex justify-start items-center gap-3">
      <div className="flex-1 flex justify-start items-center gap-3">
        {/* Rank Circle */}
        <div
          className={`w-6 h-6 p-2 rounded-[99px] inline-flex flex-col justify-center items-center gap-2 ${rankBgClass}`}
        >
          <div className="inline-flex justify-start items-start gap-1">
            <div className="w-auto min-w-[8px] text-center pt-0.5 inline-flex flex-col justify-center items-center gap-2.5">
              <Text variant={'caption04'} className={`${rankTextClass}`}>
                {rank}
              </Text>
            </div>
          </div>
        </div>

        {/* Keyword & Sentiment */}
        <div className="flex justify-start items-center gap-3">
          <Text variant={'body03'} >
            {keyword.keyword}
          </Text>
          <div
            className={`px-2 py-1.5 rounded-md flex justify-start items-start gap-1 ${sentimentBgClass}`}
          >
            <Text variant={'caption04'} className={sentimentTextClass}>
              {sentimentLabel} {sentimentPercent.toFixed(0)}%
            </Text>
          </div>
        </div>
      </div>

      {/* Count Button */}
      <button
        // 3. onClick prop 연결
        onClick={onClick}
        className="flex justify-start items-center gap-1 cursor-pointer hover:opacity-70 transition-opacity"
      >
        <Text variant={'body03'} className=" text-grayscale-gray50 ">
          {keyword.count}개의 대화
        </Text>
        {/* 아이콘 */}
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
              stroke="#A6A6A6" // Grayscale-gray50
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>
    </div>
  );
};

// ==================================================================
// 메인 컴포넌트 (Main Component)
// ==================================================================

export default function CategoryRankChart({
  keywords,
}: CategoryRankChartProps) {
  // const [isPopupOpen, setIsPopupOpen] = useState(false);
  // const [selectedKeyword, setSelectedKeyword] = useState<Keyword | null>(null);

  // --- 데이터 가공 ---
  // 'keywords'가 이미 정렬되어 있다고 가정
  const totalCount = keywords.reduce((sum, k) => sum + k.count, 0);

  const totalPositive = keywords.filter(
    (k) => k.positiveScore >= 50,
  ).length;
  const totalNegative = keywords.length - totalPositive;

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
        positiveScore: -1,
      },
    });
  }
  // --- 데이터 가공 끝 ---

  // const handleOpenPopup = (keyword: Keyword) => {
  //   setSelectedKeyword(keyword);
  //   setIsPopupOpen(true);
  // };

  // const handleClosePopup = () => {
  //   setIsPopupOpen(false);
  //   setSelectedKeyword(null);
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
                  innerRadius={40} // 도넛 차트
                  paddingAngle={0}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}-${entry.name }`}
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
          </div>

          {/* Rank List */}
          <div className="flex-1 inline-flex flex-col justify-start items-start">
            {/* 'keywords'가 이미 정렬되어 있으므로, index를 rank로 사용 */}
            {keywords.map((keyword, index) => (
              <CategoryRankItem
                key={`cell-${index}-${keyword.keyword}`}
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
         <SubjectPopup
           keyword={selectedKeyword.keyword}
           onClose={handleClosePopup}
         />
       )}
       */}
    </>
  );
}