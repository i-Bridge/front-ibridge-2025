'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Text } from '@/ui/Text';
import SubjectPopup from './SubjectPopup';
import { showError } from '@/lib/toast';
// [1] Fetcher 대신 캐시 스토어를 import 합니다.
import { useCategorySubjectsCache } from '@/hooks/parentHome/useCategorySubjects'; // 경로가 맞는지 확인하세요.
import { Category } from '@/types';

// [2] API 응답 타입 정의는 스토어로 이동했으므로 여기서는 제거합니다.
// interface SubjectListResponse { ... }

interface CategoryRankItemProps {
  // [3] prop 이름은 keyword로 유지하되, 내부 필드 keyword.category를 사용합니다.
  category: Category;
  rank: number;
}

/**
 * 카테고리 랭킹 아이템 (오른쪽 리스트의 개별 항목)
 */
export default function CategoryRankItem({
  category,
  rank,
}: CategoryRankItemProps) {
  // ... (긍정/부정, 스타일 로직은 동일) ...
  const isPositive = category.positiveScore >= 50;
  const sentimentPercent = isPositive
    ? category.positiveScore
    : 100 - category.positiveScore;

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
    rank <= 5 ? 'text-white' : 'text-grayscale-gray80';

  // [4] 로컬 'isLoading'을 'isFetching'으로 변경하고, 'subjects' state를 제거합니다.
  const [isFetching, setIsFetching] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const params = useParams();
  const childId = params.childId as string;

  // [5] 스토어에서 'fetchSubjects' 액션과 캐시 데이터를 가져옵니다.
  const fetchSubjects = useCategorySubjectsCache(
    (state) => state.fetchSubjects,
  );
  const cachedSubjects = useCategorySubjectsCache((state) =>
    state.cache.get(category.category),
  );

  // [6] onClick 핸들러를 스토어를 사용하도록 수정합니다.
  const handleClick = async () => {
    if (isFetching || !childId) return;
    setIsFetching(true);

    try {
      // [7] 스토어의 fetchSubjects를 'category' 키로 호출합니다.
      const subjects = await fetchSubjects(childId, category.category);

      // 스토어 함수가 성공적으로 데이터를 반환하면 (신규 또는 캐시)
      if (subjects !== null) {
        setShowPopup(true); // 팝업을 엽니다.
      }
      // (에러 토스트는 스토어 내부에서 처리됩니다.)
    } catch (err) {
      // 스토어 내부의 try/catch 외에 예외 발생 시 처리
      console.error('Failed to handle fetch subjects click:', err);
      showError('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsFetching(false);
    }
  };

  return (
    // [8] 팝업을 렌더링하기 위해 Fragment(<>)로 감쌉니다.
    <>
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

          {/* Keyword(Category) & Sentiment */}
          <div className="flex justify-start items-center gap-3">
            <Text variant={'body03'} className="">
              {category.category}
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
        <div
          onClick={handleClick}
          className={`flex justify-start items-center gap-1 cursor-pointer hover:opacity-70 transition-all ${
            isFetching ? 'opacity-50 cursor-wait' : '' // [9] isLoading -> isFetching
          }`}
        >
          <Text variant={'body03'} className=" text-grayscale-gray50 ">
            {category.count}개의 대화
          </Text>
          {/* --- 아이콘 --- */}
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

      {/* [10] showPopup이 true일 때 SubjectPopup을 렌더링합니다. */}
      {showPopup && (
        <SubjectPopup
          category={category.category}
          // [11] 로컬 state (subjects) 대신 스토어에서 가져온 'cachedSubjects'를 전달합니다.
          subjects={cachedSubjects || []}
          positiveScore={category.positiveScore}
          onClose={() => setShowPopup(false)}
        />
      )}
    </>
  );
}