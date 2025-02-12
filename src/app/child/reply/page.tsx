'use client';

import { useReplyStepsStore } from '@/store/child/replyStepStore';
import { useRouter } from 'next/navigation';

export default function ReplyPage() {
  const { completedSteps, completeStep } = useReplyStepsStore();
  const router = useRouter();

  const handleComplete = () => {
    completeStep();
    router.push('/child/video');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen relative p-6">
      {/* 제목 */}
      <h1 className="absolute top-4 left-1/2 transform -translate-x-1/2 text-2xl font-bold">
        답변 페이지
      </h1>
      
      {/* 캐릭터 자리 */}
      <div className="absolute left-24 top-1/2 transform -translate-y-1/2 w-80 h-60 bg-gray-300 rounded-full flex items-center justify-center text-lg font-bold">
        캐릭터
      </div>
      
      {/* 말풍선 자리 */}
      <div className="absolute left-50 top-1/3 w-80 min-h-20 bg-gray-200 p-4 rounded-lg shadow-md">
        질문내용
      </div>
      
      {/* 현재 단계 표시 및 완료 버튼 */}
      <div className="absolute bottom-13 top-2/3">
        <p className="mt-4 text-lg">현재 단계: {completedSteps + 1} / 5</p>
        <button 
          onClick={handleComplete} 
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded">
          완료
        </button>
      </div>
      
      {/* 영상 통화 화면 자리 */}
      <div className="absolute bottom-8 right-10 w-60 h-40 bg-gray-400 flex items-center justify-center text-lg font-bold">
        영상
      </div>
    </div>
  );
}
