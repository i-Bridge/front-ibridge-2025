import TalkSession from './../_components/TalkSession';
import { ChildPageParams } from '@/types/page-props';
export default async function Page({ params }: ChildPageParams) {
  // params가 Promise이므로, await를 사용해 값을 추출
  const { childId } = await params;

  if (!childId) {
    return <div> 자녀 정보 없음 </div>;
  }
  {
    return <TalkSession childId={childId} mode="free" />;
  }
}
