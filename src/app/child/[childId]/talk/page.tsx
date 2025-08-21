import { Fetcher } from '@/lib/fetcher';
import TalkClient from './_components/TalkClient';
import { ChildPageParams } from '@/types/page-props';

type HomeData = {
  emotion: boolean;
  completed: boolean;
};

export default async function TalkPage({ params }: ChildPageParams) {
  // params가 Promise이므로, await를 사용해 값을 추출
  const { childId } = await params;

  if (!childId) {
    return <div> 자녀 정보 없음 </div>;
  }

  let completed = false;
  let emotion = true;

  try {
    const res = await Fetcher<HomeData>(`/child/${childId}/home`, {
      method: 'GET',
    });
    if (res.isSuccess && res.data) {
      console.log('✅ [/talk] SSR /home data:', res.data);
      completed = res.data.completed;
      emotion = res.data.emotion;
    } else {
      console.warn('⚠️ [/talk] SSR /home 실패, 기본값 사용');
      // 실패 시: 오늘의 질문 버튼은 노출, 감정 팝업은 열지 않음
      completed = false;
      emotion = true;
    }
  } catch (e) {
    console.error('❌ [/talk] SSR /home 예외:', e);
    completed = false;
    emotion = true;
  }

  return (
    <TalkClient
      childId={childId}
      initialCompleted={completed}
      initialEmotionDone={emotion}
    />
  );
}
