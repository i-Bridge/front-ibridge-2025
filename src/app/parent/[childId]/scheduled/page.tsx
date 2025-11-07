
import { ChildPageParams } from '@/types/page-props';
import NotFound from '@/components/Exception/not-found';
import ScheduledList from './_components/ScheduledList';

  export default async function ScheduledPage({ params }: ChildPageParams) {
  // params가 Promise이므로, await를 사용해 값을 추출
  const { childId } = await params;

  if (!childId) return <NotFound message="자녀 ID가 존재하지 않습니다." />;

  

  return (
    <div>
  
         
            <ScheduledList />
         
    </div>
  );
}