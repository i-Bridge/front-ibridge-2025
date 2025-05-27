'use';

import { useState, useRef } from 'react';
import { useSubjectStore } from '@/store/question/subjectStore';
import { useSubjectData } from '@/hooks/home/useSubjectData';

interface Question {
  questionId: number;
  text: string;
  video: string;
  image: string;
  answer: string;
}

export default function AnalysisList() {
  const { selectedQuestionId, setSelectedQuestionId } = useSubjectStore();
  const { questions, subject } = useSubjectData();
  const [playingMap, setPlayingMap] = useState<{ [key: number]: boolean }>({});
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});

  if (!questions) return null;
  const selectedIndex = questions.findIndex(
    (q) => q.questionId === selectedQuestionId,
  );
  const selectedQuestion =
    selectedIndex !== -1 ? questions[selectedIndex] : null;

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
        className="w-1/2 mx-auto"
      >
        <source src={q.video} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    ) : (
      <div
        className="relative cursor-pointer w-1/2 mx-auto"
        onClick={() => handlePlayClick(q.questionId)}
      >
        <img src={q.image} alt="thumbnail" className="w-full h-auto" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-4xl">
          ▶
        </div>
      </div>
    );
  };

  let content;
  if (!selectedQuestionId) {
    // 전체 보기
    content = (
      <>
        {questions.map((q, idx) => (
          <div key={q.questionId} className="mb-4">
            <h4 className=" mb-2 text-gray-600 text-sm">
              Q{idx + 1}: {q.text}
            </h4>
            <p className="text-gray-700 mb-4 font-semibold">답변: {q.answer}</p>
            <div className="relative">{renderVideoOrThumbnail(q)}</div>
            <div className='border-t mt-4'></div>
          </div>
        ))}
      </>
    );
  } else {
    // 선택된 질문

    if (!selectedQuestion) {
      content = (
        <div className="font-sm text-gray-200">
          선택한 질문을 찾을 수 없습니다.
        </div>
      );
    } else {
      //<h4 className="  font-medium">q{selectedIndex + 1}: {selectedQuestion.text}</h4>
      content = (
        <>
          <p className="text-gray-700 ">답변: {selectedQuestion.answer}</p>
          <div className="relative mt-4 ">
            {renderVideoOrThumbnail(selectedQuestion)}
          </div>
        </>
      );
    }
  }

  return (
    <div>
      <div className=" mt-8 pt-4 mr-12 mb-20 relative ">
        {selectedQuestionId !== null ? (
          <div className="border-t">
           
            <button
              onClick={() => setSelectedQuestionId(null)}
              className="absolute  -top-3 right-8 px-1 py-0 text-sm text-white bg-orange-400 rounded-xl hover:bg-orange-200"
            >
              전체보기
            </button>
          </div>
        ):(
          <h3 className="absolute -top-6 left-0 py-3 text-sm font-light text-gray-600 ">
               
              </h3>
        )}
        <div className=" ">
          <div className="mt-3 ">{content}</div>
        </div>
      </div>
    </div>
  );
}
