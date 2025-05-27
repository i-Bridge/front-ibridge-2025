'use client';

import { useSubjectStore } from '@/store/question/subjectStore';

interface Question {
  questionId: number;
  text: string;
  video: string;
  image: string;
  answer: string;
}

interface Props {
  questions: Question[];
}

export default function QuestionList({ questions }: Props) {
  const { selectedQuestionId, setSelectedQuestionId } = useSubjectStore();

  return (
    <div className="space-y-2 ml-8 w-[600px]">
      <div className='border-2  rounded-xl px-2 '>
      {questions.map((q, index) => (
        <div
          key={q.questionId}
          onClick={() => setSelectedQuestionId(q.questionId)}
          className={`border-t cursor-pointer p-2 hover:font-semibold  ${
            selectedQuestionId === q.questionId
              ? 'font-semibold '
              : ''
          }`}
        >
          <span className="">Q{index + 1}. </span>
          {q.text}
        </div>
      ))}
</div>
      
    </div>
  );
}
