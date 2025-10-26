import Skeleton from '@/components/UI/Skeleton'; // Skeleton 컴포넌트 경로를 확인해주세요.

/**
 * /home 페이지의 메인 콘텐츠가 로드되는 동안(데이터 페칭 중)
 * 사용자에게 보여줄 스켈레톤 UI입니다.
 */
export default function HomeLoading() {
  return (
    // ✅ [수정] 헤더 스켈레톤을 제거하고, 메인 콘텐츠 스켈레톤만 남깁니다.
    <main className="p-4 sm:p-6">
      <div className="max-w-[1430px] mx-auto flex flex-col gap-2.5">
        {/* GreetingSection 스켈레톤 */}
        <Skeleton className="w-full h-[400px] rounded-[40px] shadow-md" />
        {/* DashboardCards 스켈레톤 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Skeleton className="h-[284px] rounded-[40px]" />
          <Skeleton className="h-[284px] rounded-[40px]" />
        </div>
      </div>
    </main>
  );
}
