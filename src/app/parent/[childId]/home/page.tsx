import { Fetcher } from '@/lib/fetcher';
import HomeHeader from '@/components/Header/HomeHeader';
import AiComment from '@/components/Home/aiComment';
import MonthSelector from '@/components/Home/monthSelector';
import Weekly from '@/components/Home/weekly';
import SubjectList from '@/components/Question/SubjectList';
import SubjectDetailPanel from '@/components/Question/SubjectDetailPanel';

interface Subject {
  subjectId: number;
  subjectTitle: string;
  answer: boolean;
}

interface HomeData {
  subjects: Subject[];
}

interface PageProps {
  params: {
    childId: string; 
  };
}

export default async function HomePage({ params }: PageProps) {
  const { childId } = params;

  if (!childId) {
    return <div> 403: no childId </div>;
  }

  const res = await Fetcher<HomeData>(`/parent/${childId}/home`);

  console.log('💓받아온 homeData:', res); //추후 삭제 예정

  const homeData = res.data;

  if (!homeData) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      {/* 헤더에 알림 개수 정보 전달 필요 */}
      <HomeHeader childId={childId} />
      <div className="flex flex-col justify-center items-center w-full pt-3">
        <AiComment />
        <div className="pt-4">
          <MonthSelector />
          <Weekly />
          <SubjectList initialSubjects={homeData.subjects} />
          <SubjectDetailPanel />
        </div>
      </div>
    </div>
  );
}
