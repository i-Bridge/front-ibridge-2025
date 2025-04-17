import { ServerFetcher } from '@/lib/serverFetcher';
import HomeHeader from '@/components/Header/HomeHeader';
import AIComment from '@/components/Home/AiComment';
import MonthSelector from '@/components/Home/MonthSelector';
import Weekly from '@/components/Home/Weekly';
import SubjectList from '@/components/Question/SubjectList';
import SubjectDetailPanel from '@/components/Question/SubjectDetailPanel';

interface PageProps {
  params: { childId: string };
}

interface NoticeCount {
  noticeExist: boolean;
}

interface Subject {
  subjectId: number;
  subjectTitle: string;
  answer: boolean;
}

interface HomeData {
  noticeCount: NoticeCount;
  subjects: Subject[];
}

export default async function HomePage({ params }: PageProps) {
  const { childId } = await params;

  if (!childId) {
    //꼭 오류처리할 필요는 없지만 사용자경험 위함. 나중에 오류페이지로
    return <div>params: childid load 실패</div>;
  }

  let homeData: HomeData | undefined;

  try {
    const res = await ServerFetcher<HomeData>(`/parent/${childId}/home`);
    if (!res) {
      return <div>로딩 중...</div>;
    }
    console.log('받아온 homeData:', res);
    homeData = res.data;
  } catch (err) {
    console.error('HomeData API 호출 오류:', err);
    return <div>데이터를 불러오지 못했습니다.</div>;
  }

  if (!homeData) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      {/* 헤더에 알림 개수 정보 전달 필요 */}
      <HomeHeader childId={childId} />
      <div className="flex flex-col justify-center items-center w-full pt-3">
        <AIComment />
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
