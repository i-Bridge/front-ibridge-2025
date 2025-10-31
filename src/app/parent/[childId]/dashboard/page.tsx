import { Fetcher } from '@/lib/fetcher';
import HomeHeader from '@/components/Header/HomeHeader';
import AiComment from './_components/AiComment';
import ContentSwitcher from './_components/ContentSwitcher';
import { ChildPageParams } from '@/types/page-props';
import NotFound from '@/components/Exception/not-found';
import { Subject } from '@/types/index';

interface HomeData {
  hasNext: boolean;
  subjects: Subject[];
}

interface BannerData {
  cumulativeAnswerCount: number;
  mostTalkedCategory: string;
  positiveCategory: string;
  negativeCategory: string;
  emotion: number;
  name: string;
  newGrape: number;
}
export default async function HomePage({ params }: ChildPageParams) {
  // params가 Promise이므로, await를 사용해 값을 추출
  const { childId } = await params;

  if (!childId) return <NotFound message="자녀 ID가 존재하지 않습니다." />;

  const homeRes = await Fetcher<HomeData>(`/parent/${childId}/home`);
  const bannerRes = await Fetcher<BannerData>(`/parent/${childId}/banner`);

  if (!homeRes || !homeRes.data) {
    return <NotFound message="데이터를 불러오지 못했습니다." />;
  }

  const homeData = homeRes.data;
  const bannerData = bannerRes?.data ?? {
    cumulativeAnswerCount: 0,
    mostTalkedCategory: '',
    positiveCategory: '',
    negativeCategory: '',
    emotion: 0,
    name: '',
    newGrape: 0,
  };

  if (!homeData || !bannerData) {
    return <NotFound message="데이터가 존재하지 않습니다." />;
  }
  console.log('/home', homeData);
  console.log('/banner', bannerData);

  return (
    <div>
      {/* 헤더에 알림 개수 정보 전달 필요 */}
      <div className="flex flex-col space-y-14">
        <HomeHeader childId={childId} />
        <div className="flex flex-col items-center justify-center">
          <AiComment
            childname={bannerData.name}
            cumulativeAnswerCount={bannerData.cumulativeAnswerCount}
            mostTalkedCategory={bannerData.mostTalkedCategory}
            positiveCategory={bannerData.positiveCategory}
            negativeCategory={bannerData.negativeCategory}
            emotion={bannerData.emotion}
            newGrape={bannerData.newGrape}
          />
          <div className="mt-4">
            <ContentSwitcher
              initialSubjects={homeData.subjects ?? []}
              childname={bannerData.name}
            />
          </div>
        </div>
      </div>

      <footer className="bg-gray-200 text-white text-center py-10">
        ⓒ 2025 i-Bridge. All rights reserved.
      </footer>
    </div>
  );
}
