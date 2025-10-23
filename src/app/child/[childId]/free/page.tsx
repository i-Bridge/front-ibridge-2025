import { Fetcher } from '@/lib/fetcher';
import { API } from '@/constants/api';
import TalkSession from '../_components/TalkSession';
import { ChildPageParams } from '@/types/page-props';

// 서버 컴포넌트로, 페이지에 진입하기 전에 데이터를 미리 가져옵니다.
export default async function FreeTalkPage({ params }: ChildPageParams) {
  const { childId } = await params;
  const firstPrompt = '하고 싶은 이야기를 들려줘!'; // 자유 대화의 첫 멘트

  try {
    // 1. 서버에서 '/new' API를 호출하여 subjectId만 가져옵니다.
    const { data, isSuccess } = await Fetcher<{ subjectId: number }>(
      API.new(childId),
      { method: 'GET' },
    );

    if (isSuccess && data) {
      // 2. 성공 시, subjectId와 고정된 첫 멘트를 props로 전달합니다.
      return (
        <TalkSession
          childId={childId}
          initialSubjectId={data.subjectId}
          initialQuestion={firstPrompt}
        />
      );
    } else {
      return <div>대화를 시작하는 데 실패했습니다.</div>;
    }
  } catch (error) {
    console.error('[/free] Fetch Error:', error);
    return <div>서버와 통신하는 중 오류가 발생했습니다.</div>;
  }
}
