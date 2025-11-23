import { ChildPageParams } from '@/types/page-props';
import NotFound from '@/components/Exception/not-found';
import ScheduledList from './_components/ScheduledList';
import ParentLayout from '../_components/Layout/ParentLayout';
import TitleComponent from '@/ui/Modal/TitleComponent';

export default async function ScheduledPage({ params }: ChildPageParams) {
  // params가 Promise이므로, await를 사용해 값을 추출
  const { childId } = await params;

  if (!childId) return <NotFound message="자녀 ID가 존재하지 않습니다." />;

  return (
    <ParentLayout
      title={
        <TitleComponent
          title={'평소 아이에게 궁금했던 \n주제의 질문을 작성해 보세요!'}
          align="start"
        />
      }
    >
      <ScheduledList />
    </ParentLayout>
  );
}
