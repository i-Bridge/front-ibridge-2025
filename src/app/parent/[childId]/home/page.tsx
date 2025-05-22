import { Fetcher } from '@/lib/fetcher';
import HomeHeader from '@/components/Header/HomeHeader';
import AiComment from '@/components/Home/aiComment';
import MonthSelector from '@/components/Home/monthSelector';
import Weekly from '@/components/Home/weekly';
import SubjectList from '@/components/Question/SubjectList';



interface Subject {
  subjectId: number;
  subjectTitle: string;
  answer: boolean;
}

interface HomeData {
  subjects: Subject[];
}

export default async function HomePage({ params }: { params: { childId: string } }) {
  const { childId } = params;

  if (!childId) {
    return <div> 403: no childId </div>;
  }

  const res = await Fetcher<HomeData>(`/parent/${childId}/home`);

  const homeData = res.data;

  if (!homeData) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      {/* 헤더에 알림 개수 정보 전달 필요 */}
      <div className="flex flex-col space-y-14">
        
        <HomeHeader childId={childId} />
        <AiComment />
      </div>
      <div className="flex flex-col justify-center items-center w-full pt-3">
        
        <div className="pt-4">
          <MonthSelector />
          <Weekly />
          <SubjectList initialSubjects={homeData.subjects} />
        
        </div>
      </div>
    </div>
  );
}
