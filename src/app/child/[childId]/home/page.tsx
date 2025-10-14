import { ChildPageParams } from '@/types/page-props';
import Header from './_components/Header';
import HomePageClient from './_components/HomePageClient';

// 이 페이지는 서버 컴포넌트이지만, 데이터 로딩은 상위 layout.tsx가 담당합니다.
// 여기서는 UI 컴포넌트들을 배치하는 역할만 수행합니다.
export default async function HomePage({ params }: ChildPageParams) {
  const { childId } = await params;

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <Header />
      <main className="p-4 sm:p-6">
        {/* HomePageClient가 메인 UI를 담당합니다. */}
        <HomePageClient childId={childId} />
      </main>
    </div>
  );
}
