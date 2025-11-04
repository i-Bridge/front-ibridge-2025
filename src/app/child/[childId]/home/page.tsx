import { ChildPageParams } from '@/types/page-props';
import HomePageClient from './_components/HomePageClient';

// 이 페이지는 서버 컴포넌트이지만, 데이터 로딩은 상위 layout.tsx가 담당합니다.
// 여기서는 UI 컴포넌트들을 배치하는 역할만 수행합니다.
export default async function HomePage({ params }: ChildPageParams) {
  const { childId } = await params;

  return (
      <main className="flex justify-center items-center px-10 gap-5 h-full"> 
    {/* HomePageClient는 이 h-full 영역의 중앙에 위치 */}
    <HomePageClient childId={childId} />
</main>
  );
}
