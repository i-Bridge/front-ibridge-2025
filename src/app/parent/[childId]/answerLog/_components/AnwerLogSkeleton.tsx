import Skeleton from '@/ui/loading/Skeleton';
/**
 * 분석 페이지 로딩 시 표시되는 스켈레톤 UI 컴포넌트입니다.
 * (기본 Skeleton 컴포넌트를 재사용합니다.)
 */
const AnswerLogSkeleton = () => {
  return (
    // 전체 레이아웃 (px, pt, pb, gap 등)은 동일하게 유지합니다.
    <div className="self-stretch px-10 pt-5 pb-10 inline-flex flex-col justify-start items-start gap-10 w-full">
      {/* 섹션 1 (카드 3개) */}
      <div className="self-stretch flex flex-col justify-start items-start gap-4 w-full">
        {/* 2. 제목 스켈레톤:
          기존 div 대신 <Skeleton>을 사용합니다.
          className으로 크기(w-80 h-6)와
          기본 radius를 덮어쓰는 'rounded-[20px]'를 전달합니다.
        */}
        <Skeleton className="w-80 h-6 rounded-[20px]" />

        <div className="self-stretch flex flex-col justify-start items-start gap-5">
          {/*
            3. 카드 스켈레톤:
            크기(self-stretch h-24)만 전달합니다.
            radius는 기본값인 'rounded-[40px]'가 적용됩니다.
          */}
          <Skeleton className="self-stretch h-24" />
          <Skeleton className="self-stretch h-24" />
          <Skeleton className="self-stretch h-24" />
        </div>
      </div>

      {/* 섹션 2 (카드 1개) */}
      <div className="self-stretch flex flex-col justify-start items-start gap-4 w-full">
        <Skeleton className="w-80 h-6 rounded-[20px]" />

        <div className="self-stretch flex flex-col justify-start items-start gap-5">
          <Skeleton className="self-stretch h-24" />
        </div>
      </div>

      {/* 섹션 3 (카드 1개) */}
      <div className="self-stretch flex flex-col justify-start items-start gap-4 w-full">
        <Skeleton className="w-80 h-6 rounded-[20px]" />

        <div className="self-stretch flex flex-col justify-start items-start gap-5">
          <Skeleton className="self-stretch h-24" />
        </div>
      </div>
    </div>
  );
};

export default AnswerLogSkeleton;
