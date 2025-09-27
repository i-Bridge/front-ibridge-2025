import TalkMenu from './_components/TalkMenu';
import { ChildPageParams } from '@/types/page-props';

export default async function TalkPage({ params }: ChildPageParams) {
  const { childId } = await params;

  return <TalkMenu childId={childId} />;
}
