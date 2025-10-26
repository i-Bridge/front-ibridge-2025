import { Fetcher } from '@/lib/fetcher';
import { API } from '@/constants/api';
import TalkSession from '../_components/TalkSession';
import { ChildPageParams } from '@/types/page-props';

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
    const { data, isSuccess } = await Fetcher<PredesignedData>(
      API.predesigned(childId),
      { method: 'GET' },
    );

    if (isSuccess && data && data.questions.length > 0) {
      console.log(data);
      // ✅ [수정] API 응답을 '이전 기록'과 '현재 질문'으로 분리합니다.
      // 1. user가 null인 마지막 항목이 '현재 질문'입니다.
      const lastQuestion = data.questions[data.questions.length - 1];

      // 2. 그 외의 모든 항목이 '이전 대화 기록'입니다.
      const history = data.questions.slice(0, data.questions.length - 1);

      return (
        <TalkSession
          childId={childId}
          initialSubjectId={data.subjectId}
          initialQuestion={lastQuestion.ai} // ✅ 현재 질문 전달
          history={history} // ✅ 이전 기록 전달
          mode="question" // ✅ 모달 문구 분기를 위해 mode 전달
        />
      );
    } else {
      return <div>오늘의 질문을 불러오는 데 실패했습니다.</div>;
    }
  } catch (error) {
    console.error('[/talk/question] Fetch Error:', error);
    return <div>서버와 통신하는 중 오류가 발생했습니다.</div>;
  }
}
