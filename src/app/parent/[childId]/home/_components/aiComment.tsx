'use client';
import { useState, useEffect, useRef } from 'react';

const bannerTitles = [
  '최근 아이가 즐거움을 느끼며 자주 이야기하는 주제가 있어요 ✨ 함께 살펴볼까요?',
  '가끔 아이가 고민이나 어려움을 느낄 수 있어요. ⚠️ 어떤 이야기에서 그런 마음이 담겼는지 살짝 확인해봐요.',
  '이번 달, 아이가 자주 느낀 감정들을 들여다볼까요? 😄 오늘은 어떤 기분이었을까요?',
  '아이가 어떤 생각을 공유했는지 확인해볼까요?',
  '요즘 아이가 자주 관심을 갖는 주제는 무엇일까요?',
];

const mockupData = [
  '최근 아이는 슬라임에 관심이 많으며, 다양한 재료를 섞어보는 것을 즐기고 있습니다.',

  '아이의 장래 희망은 우주 비행사이며, 우주에 가보고 싶은 이유를 이야기했습니다.',

  '요즘 가장 좋아하는 놀이는 블록 쌓기이며, 더 높은 구조물을 만들고 싶어 합니다.',

  '최근 관심 있는 주제는 공룡이며, 티라노사우루스에 대해 더 많이 알고 싶어 합니다.',

  '아이에게 ‘세상에서 가장 좋아하는 음식’을 물어보았을 때, 초코 아이스크림이라고 답했습니다.',
];
const emojiData = [
  '🙂', // 첫 번째 문장 - 아이가 혼자 있는 시간을 선호하는 상태
  '🙂', // 두 번째 문장 - 피곤해하고 쉬고 싶어하는 상태
  '🤔', // 세 번째 문장 - 마음이 복잡할 때 멍하니 있는 상태
  '📚', // 네 번째 문장 - 공부에 어려움을 겪고 있지만 노력하는 상태
  '😄', // 다섯 번째 문장 - 친구와 즐겁게 놀면서 기분이 좋아진 상태
];

export default function AiComment(childname: {childname: string}) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentTitle, setCurrentTitle] = useState('');
  const typingIntervalRef = useRef<number | null>(null);

  // 랜덤 문장 선택
  const pickRandomTitle = () => {
    const randomIndex = Math.floor(Math.random() * bannerTitles.length);
    setCurrentTitle(bannerTitles[randomIndex]);
  };

  // 타이핑 애니메이션
  useEffect(() => {
    if (!currentTitle) return;

    // 이전 interval 제거
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }

    setDisplayedText(''); // 이전 글자 초기화
    let index = 0;

    typingIntervalRef.current = window.setInterval(() => {
      setDisplayedText(currentTitle.slice(0, index + 1));
      index++;
      if (index >= currentTitle.length && typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
    }, 30);

    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
    };
  }, [currentTitle]);

  // 30초마다 문장 변경
  useEffect(() => {
    pickRandomTitle(); // 초기 문장 선택

    const intervalId = window.setInterval(() => {
      pickRandomTitle();
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);
  return (
    <div className="flex justify-center py-4">
      <div className="w-4/5 max-w-7xl bg-orange-300 p-10 overflow-hidden rounded-3xl shadow-lg">
        <div className="w-full mx-auto text-md space-y-2 flex flex-col items-center">

          {/* 배너 설명 멘트 */}
          <div className="bg-orange-100 h-1/2 max-w-5xl rounded-3xl flex  justify-center items-center p-6 min-h-[3rem] mb-8">
            <div className="min-h-[2rem]">
              <h2 className=" text-gray-900 ">
                {childname.childname}의 이야기
              </h2>
              <h2 className="text-xl font-bold text-center text-gray-900 ">
                {displayedText}
              </h2>
              
            </div>
          </div>

          {/* 배너 요소 그리드 컨테이너 */}
          <div className="flex flex-wrap justify-center gap-4">
            {mockupData.map((text, index) => (
              <div
                key={index}
                className="bg-white px-4 py-2 rounded-xl shadow-md flex items-center border border-gray-200 max-w-xs break-words"
              >
                <span className="mr-2 text-2xl">
                  {emojiData[index % emojiData.length]}
                </span>
                <span className="text-base font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
