'use client';

import CategoryRankItem from './CategoryRankItem';





interface CategoryRankListProps {
  keywords: Keyword[];
}

/**
 * 카테고리 랭킹 리스트 (오른쪽 영역)
 */
export default function CategoryRankList({
  keywords,
}: CategoryRankListProps) {
  return (
    <div className="flex-1 inline-flex flex-col justify-start items-start">
      {keywords.map((keyword, index) => (
        <CategoryRankItem
          key={keyword.category + '-' + index}
          keyword={keyword}
          rank={index + 1}
        
        />
      ))}
    </div>
  );
}