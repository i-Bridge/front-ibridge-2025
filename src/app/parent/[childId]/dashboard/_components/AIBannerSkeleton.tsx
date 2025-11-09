import Skeleton from "@/ui/loading/Skeleton";

export default function AiCommentSkeleton() {
  return (
    <div className="w-full self-stretch inline-flex flex-col justify-start items-start gap-5">
      {/* 1. 가장 많이 한 이야기 주제 */}
      <div className="w-full flex flex-col justify-start items-start gap-2 rounded-[40px] py-8 px-6 bg-secondary-secondaryMedium">
        <Skeleton className="w-32 h-4 mb-2" /> {/* 제목 영역 */}
        <Skeleton className="w-1/2 h-5" /> {/* 내용 영역 */}
      </div>

      {/* 2. 긍정/부정 주제 래퍼 */}
      <div className="w-full self-stretch flex justify-start items-start gap-5">
        {/* 긍정적인 주제 */}
        <div className="flex-1 flex flex-col justify-start items-start gap-2 rounded-[40px] py-8 px-6 bg-other-mint-light">
          <Skeleton className="w-24 h-4 mb-2" />
          <Skeleton className="w-2/3 h-5" />
        </div>

        {/* 부정적인 주제 */}
        <div className="flex-1 flex flex-col justify-start items-start gap-2 rounded-[40px] py-8 px-6 bg-error-errorLight">
          <Skeleton className="w-24 h-4 mb-2" />
          <Skeleton className="w-2/3 h-5" />
        </div>
      </div>
    </div>
  );
}
