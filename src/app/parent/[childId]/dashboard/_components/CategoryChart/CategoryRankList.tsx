'use client';

import CategoryRankItem from './CategoryRankItem';



export interface Keyword {
  category: string;
  count: number;
  positiveScore: number;
}


interface CategoryRankListProps {
  keywords: Keyword[];
  onItemClick: (keyword: Keyword) => void;
}

/**
 * 카테고리 랭킹 리스트 (오른쪽 영역)
 */
export default function CategoryRankList({
  keywords,
  onItemClick,
}: CategoryRankListProps) {
  return (
    <div className="flex-1 inline-flex flex-col justify-start items-start">
      {keywords.map((keyword, index) => (
        <CategoryRankItem
          key={keyword.category + '-' + index}
          keyword={keyword}
          rank={index + 1}
          onClick={() => onItemClick(keyword)}
        />
      ))}
    </div>
  );
}