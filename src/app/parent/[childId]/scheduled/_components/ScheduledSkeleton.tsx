import Skeleton from '@/ui/loading/Skeleton';

/**
 * 요청하신 HTML 구조를 기반으로 한 스켈레톤 UI 컴포넌트입니다.
 * (AnswerLogSkeleton과 동일한 Skeleton 컴포넌트를 재사용합니다.)
 */
const ScheduledSkeleton = () => {
  return (
    // 1. 전체 레이아웃 (px, pt, pb, gap)은 HTML 구조를 따릅니다.
    // w-full을 추가하여 너비를 보장합니다.
    <div className="self-stretch px-10 pt-5 pb-10 inline-flex flex-col justify-start items-start gap-10 w-full">
      {/* 2. HTML의 첫 번째 내부 div */}
      <div className="self-stretch flex flex-col justify-start items-start gap-4 w-full">
        {/* 3. HTML의 두 번째 내부 div (카드 5개 래퍼) */}
        <div className="self-stretch flex flex-col justify-start items-start gap-5 w-full">
          {/* 4. 5개의 카드 스켈레톤:
            HTML의 'self-stretch h-24' 클래스를 전달합니다.
            'rounded-[40px]'는 Skeleton의 기본값으로 적용됩니다.
          */}
          <Skeleton className="self-stretch h-32" />
          <Skeleton className="self-stretch h-32" />
          <Skeleton className="self-stretch h-32" />
          <Skeleton className="self-stretch h-32" />
          <Skeleton className="self-stretch h-32" />
          <Skeleton className="self-stretch h-32" />
          <Skeleton className="self-stretch h-32" />
          <Skeleton className="self-stretch h-32" />
          <Skeleton className="self-stretch h-32" />
          <Skeleton className="self-stretch h-32" />
          <Skeleton className="self-stretch h-32" />
          <Skeleton className="self-stretch h-32" />
          <Skeleton className="self-stretch h-32" />
          <Skeleton className="self-stretch h-32" />
        </div>
      </div>
    </div>
  );
};

export default ScheduledSkeleton;