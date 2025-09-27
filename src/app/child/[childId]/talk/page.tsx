import TalkMenu from './_components/TalkMenu';
import { ChildPageParams } from '@/types/page-props';
import TalkMenu from './_components/TalkMenu';

export default async function TalkPage({ params }: ChildPageParams) {
  const { childId } = await params;

  //  TTalkMenu는 이제 스스로 Zustand에서 상태를 가져오므로 childId만 넘겨주면 됩니다.
  return <TalkMenu childId={childId} />;
}
