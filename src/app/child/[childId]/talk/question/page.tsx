import TalkSession from './../_components/TalkSession';
import { ChildPageParams } from '@/types/page-props';

export default async function Page({
  params,
}: {
  params: { childId: string };
}) {
  const { childId } = await params;

  if (!childId) {
    return <div> 자녀 정보 없음 </div>;
  }
  {
    return <TalkSession childId={childId} mode="question" />;
  }
}
