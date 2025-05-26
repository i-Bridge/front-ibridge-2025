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
    <div className="space-y-2 ml-16">
      <div className='bg-gray-100 rounded-xl px-2'>
      {questions.map((q, index) => (
        <div
          key={q.questionId}
          onClick={() => setSelectedQuestionId(q.questionId)}
          className={`cursor-pointer p-2 hover:font-semibold  ${
            selectedQuestionId === q.questionId
              ? ' '
              : ''
          }`}
        >
          <span className="font-semibold">q{index + 1}. </span>
          {q.text}
        </div>
      ))}
</div>
      
    </div>
  );
}
