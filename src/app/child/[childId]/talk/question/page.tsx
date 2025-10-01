import { Fetcher } from '@/lib/fetcher';
import { API } from '@/constants/api';
import TalkSession from '../_components/TalkSession';
import { ChildPageParams } from '@/types/page-props'; // 프로젝트에 맞는 타입 경로로 수정하세요.

type QuestionItem = {
  ai: string;
  user: string | null;
};

type PredesignedData = {
  subjectId: number;
  questions: QuestionItem[];
};

// 서버 컴포넌트로, 페이지에 진입하기 전에 데이터를 미리 가져옵니다.
export default async function QuestionTalkPage({ params }: ChildPageParams) {
  const { childId } = await params;

  try {
    // 1. 서버에서 '/predesigned' API를 호출하여 질문과 subjectId를 가져옵니다.
    const { data, isSuccess } = await Fetcher<PredesignedData>(
      API.predesigned(childId),
      { method: 'GET' },
    );

    if (isSuccess && data) {
      const lastQuestionItem = data.questions?.[data.questions.length - 1];

      if (lastQuestionItem) {
        // ✅ [수정] 마지막 항목의 'ai' 텍스트를 initialQuestion으로 전달합니다.
        return (
          <TalkSession
            childId={childId}
            initialSubjectId={data.subjectId}
            initialQuestion={lastQuestionItem.ai}
          />
        );
      } else {
        // questions 배열이 비어있는 경우
        return <div>질문 목록을 찾을 수 없습니다.</div>;
      }
    } else {
      // API 호출은 성공했으나, data가 없는 경우 (논리적 에러)
      return <div>오늘의 질문을 불러오는 데 실패했습니다.</div>;
    }
  } catch (error) {
    // 네트워크 에러 등 API 호출 자체가 실패한 경우
    console.error('[/talk/question] Fetch Error:', error);
    return <div>서버와 통신하는 중 오류가 발생했습니다.</div>;
  }
}
