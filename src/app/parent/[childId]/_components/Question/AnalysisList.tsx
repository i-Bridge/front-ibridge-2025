import Image from 'next/image';
import { useState, useRef } from 'react';
import { useSubjectData } from '@/hooks/parentHome/useSubjectData';
import { Question } from '@/types/index';

export default function AnalysisList() {
  const { questions } = useSubjectData();
  const [playingMap, setPlayingMap] = useState<{ [key: number]: boolean }>({});
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});

  if (!questions) return null;

  const handlePlayClick = (questionId: number) => {
    setPlayingMap((prev) => ({ ...prev, [questionId]: true }));
    setTimeout(() => {
      videoRefs.current[questionId]?.play();
    }, 0);
  };

  const handleVideoEnd = (questionId: number) => {
    setPlayingMap((prev) => ({ ...prev, [questionId]: false }));
  };

  const renderVideoOrThumbnail = (q: Question) => {
    const isPlaying = playingMap[q.questionId];
    return isPlaying ? (
      <video
        ref={(el: HTMLVideoElement | null) => {
          videoRefs.current[q.questionId] = el;
        }}
        controls
        onEnded={() => handleVideoEnd(q.questionId)}
        className="w-40 h-28 object-cover rounded-lg shadow"
      >
        <source src={q.video} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    ) : (
      <div
        className="relative cursor-pointer w-40 h-28"
        onClick={() => handlePlayClick(q.questionId)}
      >
        <Image
          src={q.image}
          alt="썸네일"
          width={160}
          height={112}
          className="w-full h-full object-cover rounded-lg shadow"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/50 rounded-full p-2">
            <span className="text-white text-xl">▶</span>
          </div>
        </div>
      </div>
    );
  };

  const renderQuestionCard = (q: Question, idx: number) => (
    <div
      key={q.questionId}
      className="bg-white rounded-2xl p-6 mb-6 shadow-md"
    >
      {/* 질문 */}
      <h4 className="text-base font-semibold text-gray-800 mb-4">
        Q{idx + 1}. {q.text}
      </h4>

      {/* 영상 + 답변 2열 레이아웃 */}
      <div className="flex items-start gap-6">
        <p className="text-gray-700 leading-relaxed flex-1">{q.answer}</p>
        {renderVideoOrThumbnail(q)}
      </div>
    </div>
  );

  return (
    <div className="mt-8 mb-20 relative bg-orange-200 p-10 rounded-3xl">
      {questions.map((q, idx) => renderQuestionCard(q, idx))}
    </div>
  );
}
