'use client'

import { useReplyStepsStore } from '@/store/child/replyStepStore';

export default function Progress() {
  const { completedSteps } = useReplyStepsStore();

  return (
    <div className="flex justify-center gap-2 mt-4">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className={`w-10 h-10 rounded-full border-2 ${index < completedSteps ? 'bg-blue-500' : 'bg-gray-300'}`}
        />
      ))}
    </div>
  );
};
