'use client';

import {  useMemo } from 'react';
import CategoryPieChart from './CategoryPieChart';
import CategoryRankList from './CategoryRankList';
import { Text } from '@/ui/Text';
import {Category} from '@/types';

export interface PieData {
  name: string;
  value: number;
  // 원본 데이터를 툴팁 등에서 사용하기 위해 포함
  original: Category | { category: string; count: number; positiveScore: number };
[key: string]: unknown;
}

// 컴포넌트 Props
interface CategoryRankChartProps {
  categorys: Category[];
}

/**
 * 차트 데이터를 가공하는 함수
 * (컴포넌트가 리렌더링될 때마다 실행되지 않도록 useMemo와 함께 사용)
 */
function processChartData(categorys: Category[]) {
  const category=categorys ?? [];
  const totalCount = category.reduce((sum, k) => sum + k.count, 0);

  // 긍정/부정 카테고리 개수 (차트 중앙)
  const totalPositive = category.filter((k) => k.positiveScore >= 50).length;
  const totalNegative = category.length - totalPositive;

  // 파이 차트 데이터: 1~5위 + 기타
  const top5Keywords = category.slice(0, 5);
  const otherKeywords = category.slice(5);
  const otherCount = otherKeywords.reduce((sum, k) => sum + k.count, 0);

  const pieData: PieData[] = top5Keywords.map((k) => ({
    name: k.category,
    value: k.count,
    original: k,
  }));

  if (otherCount > 0) {
    pieData.push({
      name: '기타',
      value: otherCount,
      original: {
        category: '기타',
        count: otherCount,
        positiveScore: -1, // '기타'는 긍/부정 없음
      },
    });
  }

  return { totalCount, totalPositive, totalNegative, pieData };
}

/**
 * 메인 카테고리 순위 차트 컴포넌트
 * (기존 CategoryRankChart)
 */
export default function CategoryRankChart({
  categorys,
}: CategoryRankChartProps) {

  // useMemo를 사용해 keywords props가 변경될 때만 데이터 재가공
  const { totalCount, totalPositive, totalNegative, pieData } = useMemo(
    () => processChartData(categorys),
    [categorys],
  );

 

  return (
    <>
      <div className="w-full px-10 py-8 bg-white rounded-[20px] border  border-1 border-grayscale-gray20 inline-flex flex-col justify-center items-start gap-10">
        {/* Title */}
        <div className="inline-flex justify-start items-center gap-2">
          <Text variant={'title04'}>카테고리 순위</Text>
        </div>

        {/* Chart & List */}
        <div className="self-stretch inline-flex justify-start items-center gap-20">
          {/* Pie Chart */}
          <CategoryPieChart
            pieData={pieData}
            totalCount={totalCount}
            totalPositive={totalPositive}
            totalNegative={totalNegative}
          />

          {/* Rank List */}
          <CategoryRankList keywords={categorys} />
        </div>
      </div>


    </>
  );
}
