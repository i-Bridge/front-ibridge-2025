import { Fetcher } from '@/lib/fetcher';
import HomeHeader from '@/components/Header/HomeHeader';
import AiComment from '@/app/parent/[childId]/home/_components/AiComment';
import MonthSelector from './_components/MonthSelector';
import Weekly from './_components/Weekly';
import SubjectList from '@/components/Question/SubjectList';
import { ChildPageParams } from '@/types/page-props';
import NotFound from '@/components/Exception/not-found';
import HomeLoading from './loading';

interface Subject {
  subjectId: number;
  subjectTitle: string;
  answer: boolean;
}

interface HomeData {
  name: string; // 자녀 이름
  subjects: Subject[];
  cumulativeAnswerCount: number;
  mostTalkedCategory: string;
  positiveCategory: string;
  negativeCategory: string;
  emotion: number;
  newGrape: number;
}

export default async function HomePage({ params }: ChildPageParams) {
  // params가 Promise이므로, await를 사용해 값을 추출
  const { childId } = await params;

  if (!childId) return <NotFound message="자녀 ID가 존재하지 않습니다." />;

  const homeRes = await Fetcher<HomeData>(`/parent/${childId}/home`);

  const homeData = homeRes.data;
  console.log("/home",homeData);

  if (!homeData) {
    return <div>로딩 중...</div>;
  }

  // 이후
  if (!homeData) return <HomeLoading />;

  return (
    <div>
      {/* 헤더에 알림 개수 정보 전달 필요 */}
      <div className="flex flex-col space-y-14">
        <HomeHeader childId={childId} />
        <AiComment
          childname={homeData.name}
          cumulativeAnswerCount={homeData.cumulativeAnswerCount}
          mostTalkedCategory={homeData.mostTalkedCategory}
          positiveCategory={homeData.positiveCategory}
          negativeCategory={homeData.negativeCategory}
          emotion={homeData.emotion}
          newGrape={homeData.newGrape}
        />
      </div>
      <div className="flex flex-col justify-center items-center w-full pt-3">
        <div className="pt-4">
          <MonthSelector />
          <Weekly childId={childId} />
        </div>
      </div>
      <div className="px-8">
        <SubjectList initialSubjects={homeData.subjects} />
      </div>
      <footer className="bg-gray-200 text-white text-center py-10">
        ⓒ 2025 i-Bridge. All rights reserved.
      </footer>
    </div>
  );
}
