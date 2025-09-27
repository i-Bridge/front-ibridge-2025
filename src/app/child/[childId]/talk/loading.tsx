import Skeleton from '@/components/UI/Skeleton'; // 👈 수정된 Tailwind Skeleton 컴포넌트 경로

// TalkPage를 위한 로딩 스켈레톤
export default function TalkMenuLoading() {
  return (
    <section className="flex flex-col items-center gap-6 py-10 relative">
      {/* h2 제목 스켈레톤 */}
      <Skeleton className="h-8 w-80 rounded-lg" />
      {/* p 부제 스켈레톤 */}
      <Skeleton className="h-6 w-72 rounded-lg" />

      <div className="mt-4 flex flex-col gap-4">
        {/* '오늘의 질문' 버튼 스켈레톤 */}
        <Skeleton className="w-72 h-20 rounded-2xl" />

        {/* '하고싶은 말' 버튼 스켈레톤 */}
        <Skeleton className="w-72 h-20 rounded-2xl" />
      </div>
    </section>
  );
}
