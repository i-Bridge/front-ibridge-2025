import { useSubjectStore } from "@/store/question/subjectStore";
import { useSubjectData } from "@/hooks/home/useSubjectData";

export default function AnalysisList() {
  const { selectedQuestionId } = useSubjectStore();
  const { subject, questions } = useSubjectData();

  if (!subject || !questions) return null;

  // 선택된 질문이 없을 경우 모든 질문 표시
  if (!selectedQuestionId) {
    return (
      <div className="mt-4 border-t pt-4">
        <h3 className="text-lg font-semibold mb-2">모든 질문 분석</h3>
        {questions.map((q) => (
          <div key={q.questionId} className="mb-4">
            <h4 className="font-medium">질문 {q.questionId}: {q.text}</h4>
            <p className="text-gray-700">답변: {q.answer}</p>
            <a href={q.video} target="_blank" rel="noopener noreferrer" className="text-blue-600">영상 보기</a>
          </div>
        ))}
      </div>
    );
  }

  // 선택된 질문이 있을 경우 해당 질문만 표시
  const selectedQuestion = questions.find((q) => q.questionId === selectedQuestionId);

  if (!selectedQuestion) return <div>선택한 질문을 찾을 수 없습니다.</div>;

  return (
    <div className="mt-4 border-t pt-4">
      <h3 className="text-lg font-semibold mb-2">선택된 질문 분석</h3>
      <h4 className="font-medium">질문 {selectedQuestion.questionId}: {selectedQuestion.text}</h4>
      <p className="text-gray-700">답변: {selectedQuestion.answer}</p>
      <a href={selectedQuestion.video} target="_blank" rel="noopener noreferrer" className="text-blue-600">영상 보기</a>
    </div>
  );
}
