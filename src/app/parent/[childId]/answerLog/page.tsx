import { ChildPageParams } from '@/types/page-props';
import NotFound from '@/components/Exception/not-found';
import { Subject } from '@/types/index';
import { Fetcher } from '@/lib/api/fetcher';
import SubjectList from './_components/ScrollSubjectList';
import ParentLayout from '../_components/Layout/ParentLayout';
import { Suspense } from 'react';
import AnswerLogSkeleton from './_components/AnwerLogSkeleton';
import TitleComponent from '@/ui/Modal/TitleComponent';

interface HomeData {
  hasNext: boolean;
  subjects: Subject[];
}
export default async function HomePage({ params }: ChildPageParams) {
  // params가 Promise이므로, await를 사용해 값을 추출
  const { childId } = await params;

  if (!childId) return <NotFound message="자녀 ID가 존재하지 않습니다." />;

  const homeRes = await Fetcher<HomeData>(`/parent/${childId}/home`);

  if (!homeRes || !homeRes.data) {
    return <NotFound message="데이터를 불러오지 못했습니다." />;
  }

  const homeData = homeRes.data;

  if (!homeData) {
    return <NotFound message="데이터가 존재하지 않습니다." />;
  }
  console.log('/home', homeData);
  const initialSubjects = homeData.subjects;

  return (
    <ParentLayout
      title={
        <TitleComponent title={'우리 아이의\n대화 기록이에요.'} align='start' />
        
      }
    >
      <Suspense fallback={<AnswerLogSkeleton />}>
        <SubjectList initialSubjects={initialSubjects} />
      </Suspense>
    </ParentLayout>
  );
}
