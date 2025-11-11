'use client';

import CategoryRankItem from './CategoryRankItem';
import { Category } from '@/types';


interface CategoryRankListProps {
  keywords: Category[];
}

/**
 * 카테고리 랭킹 리스트 (오른쪽 영역)
 */
export default function CategoryRankList({
  keywords = [],
}: CategoryRankListProps) {
  return (
    <div className="flex-1 inline-flex flex-col justify-start items-start">
      {keywords.map((category, index) => (
        <CategoryRankItem
          key={category + '-' + index}
          keyword={category}
          rank={index + 1}
        
        />
      ))}
    </div>
  );
}