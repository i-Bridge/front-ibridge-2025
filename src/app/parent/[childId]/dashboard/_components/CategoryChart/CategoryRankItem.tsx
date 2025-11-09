'use client';

import {Text} from '@/ui/Text';


export interface Keyword {
 category: string;
  count: number;
  positiveScore: number;
}



interface CategoryRankItemProps {
  keyword: Keyword;
  rank: number;
  onClick: () => void;
}

/**
 * 카테고리 랭킹 아이템 (오른쪽 리스트의 개별 항목)
 */
export default function CategoryRankItem({
  keyword,
  rank,
  onClick,
}: CategoryRankItemProps) {
  const isPositive = keyword.positiveScore >= 50;
  const sentimentPercent = isPositive
    ? keyword.positiveScore
    : 100 - keyword.positiveScore;

    console.log('Keyword:', keyword.category, 'Positive Score:', keyword.positiveScore, 'Sentiment Percent:', sentimentPercent); 

  const sentimentLabel = isPositive ? '긍정' : '부정';
  const sentimentBgClass = isPositive
    ? 'bg-success-successLight'
    : 'bg-error-errorLight';
  const sentimentTextClass = isPositive
    ? 'text-success-success'
    : 'text-error-error';
  // 1~5위는 진한 회색, 6위부터는 연한 회색
  const rankBgClass =
    rank <= 5 ? 'bg-grayscale-gray80' : 'bg-grayscale-gray10';
  const rankTextClass =
    rank <= 5 ? 'text-white' : 'text-grayscale-gray80';

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
          <Text variant={'body03'} className=''>
            {keyword.category}
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

      {/* Count Button (현재는 div로 클릭 이벤트만 처리) */}
      <div
         onClick={onClick}
        className="flex justify-start items-center gap-1 cursor-pointer hover:opacity-70 transition-opacity"
      >
        <Text variant={'body03'} className=" text-grayscale-gray50 ">
          {keyword.count}개의 대화
        </Text>
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
              stroke="#A6A6A6" // Grayscale-gray50
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}