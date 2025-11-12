import { Fetcher } from '@/lib/api/fetcher';

import Calendar from './_components/Calendar';
import { ChildPageParams } from '@/types/page-props';
import NotFound from '@/components/Exception/not-found';
import { StatEmotionResponse} from '@/types/index';

export default async function DashBoardPage({ params }: ChildPageParams) {
  // params가 Promise이므로, await를 사용해 값을 추출
  const { childId } = await params;

  if (!childId) return <NotFound message="자녀 ID가 존재하지 않습니다." />;
  const statisticRes = await Fetcher<StatEmotionResponse>(
    `/parent/${childId}/stat/emotion`,
  );
  const statisticData = statisticRes.data;
  console.log('로그 찍기', statisticData);
  if (!statisticData) {
    return <div>분석 데이터 불러오기 실패...</div>;
  }
  return (
    <Calendar
      childId={childId}
      defaultemotions={statisticData.emotions}
      mostEmotion={statisticData.emotion}
      signupDate={statisticData.signupDate}
    />
  );
}
