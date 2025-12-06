'use client';

import { useMemo } from 'react';
import CategoryPieChart from './CategoryPieChart';
import CategoryRankList from './CategoryRankList';
import { Text } from '@/ui/Text';
import { Category } from '@/types';
import EmptyPlaceholder from '@/ui/loading/EmptyPlaceHolder';

export interface PieData {
  name: string;
  value: number;
  original: Category | { category: string; count: number; positiveScore: number };
  [key: string]: unknown;
}

interface CategoryRankChartProps {
  categories?: Category[] | undefined;
}

function processChartData(categorys: Category[]) {
  const category = categorys ?? [];
  const totalCount = category.reduce((sum, k) => sum + k.count, 0);

  const totalPositive = category.filter((k) => k.positiveScore >= 50).length;
  const totalNegative = category.length - totalPositive;

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
        positiveScore: -1,
      },
    });
  }

  return { totalCount, totalPositive, totalNegative, pieData };
}

export default function CategoryRankChart({
  categories,
}: CategoryRankChartProps) {
  const { totalCount, totalPositive, totalNegative, pieData } = useMemo(
    () => processChartData(categories || []),
    [categories]
  );

  // 데이터가 존재하는지 확인 (undefined, null, 빈 배열 체크)
  const hasData = categories && categories.length > 0;

  return (
    <>
      <div className="w-full px-5 lg:px-10 py-8 bg-white rounded-[20px] border border-1 border-grayscale-gray20 inline-flex flex-col justify-center items-start gap-10">
        {/* Title */}
        <div className="inline-flex justify-start items-center gap-2">
          <Text variant={'title04'}>카테고리 순위</Text>
        </div>

        {/* Content Area: 데이터 유무에 따라 분기 처리 */}
        {hasData ? (
          /* 데이터가 있을 때: 차트 및 리스트 표시 */
          <div className="self-stretch lg:inline-flex lg:flex-row flex flex-col justify-start items-center gap-20">
            {/* Pie Chart */}
            <CategoryPieChart
              pieData={pieData}
              totalCount={totalCount}
              totalPositive={totalPositive}
              totalNegative={totalNegative}
            />

            {/* Rank List */}
            <CategoryRankList categories={categories} />
          </div>
        ) : (
          /* 데이터가 없을 때: 안내 문구 표시 */
          <div className="w-full flex justify-center items-center">
            <EmptyPlaceholder>아직 카테고리의<br />데이터가 없어요!</EmptyPlaceholder>
          </div>
        )}
      </div>
    </>
  );
}