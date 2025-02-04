// src/app/child/reply

'use client';

import { useReplyStepsStore } from '@/store/child/replyStepStore';
import { useRouter } from 'next/navigation';

export default function ReplyPage() {
  const { completedSteps, completeStep } = useReplyStepsStore();
  const router = useRouter();

  const handleComplete = () => {
    completeStep();
    router.push('/child/home');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">답변 페이지</h1>
      <p className="mt-4 text-lg">현재 단계: {completedSteps + 1} / 5</p>
      <button onClick={handleComplete} className="mt-6 px-4 py-2 bg-blue-500 text-white rounded">완료</button>
    </div>
  );
}
