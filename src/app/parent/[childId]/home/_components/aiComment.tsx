'use client';
import { useState, useEffect, useRef } from 'react';

const bannerTitles = [
  '최근 아이가 즐거움을 느끼며 자주 이야기하는 주제가 있어요 ✨ 함께 살펴볼까요?',
  '가끔 아이가 고민이나 어려움을 느낄 수 있어요. ⚠️ 어떤 이야기에서 그런 마음이 담겼는지 살짝 확인해봐요.',
  '이번 달, 아이가 자주 느낀 감정들을 들여다볼까요? 😄 오늘은 어떤 기분이었을까요?',
  '아이가 어떤 생각을 공유했는지 확인해볼까요?',
  '요즘 아이가 자주 관심을 갖는 주제는 무엇일까요?',
];


interface AICommentData {
  childname: string; // 자녀 이름
  cumulativeAnswerCount: number;
  newGrape: number;
  mostTalkedCategory: string;
  positiveCategory: string;
  negativeCategory: string;
  emotion: number | null; // 없으면 null
}

export default function AiComment({
  childname,
  cumulativeAnswerCount,
  newGrape,
  mostTalkedCategory,
  positiveCategory,
  negativeCategory,
  emotion,
}: AICommentData) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentTitle, setCurrentTitle] = useState('');
  const typingIntervalRef = useRef<number | null>(null);

  const name = childname || '아이';

  // 랜덤 배너 타이틀 선택
  const pickRandomTitle = () => {
    const randomIndex = Math.floor(Math.random() * bannerTitles.length);
    setCurrentTitle(bannerTitles[randomIndex]);
  };


  // 타이핑 애니메이션
  useEffect(() => {
    if (!currentTitle) return;

    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }

    setDisplayedText('');
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
    pickRandomTitle();
    const intervalId = window.setInterval(() => {
      pickRandomTitle();
    }, 30000);
    return () => clearInterval(intervalId);
  }, []);

// 한글 받침 확인 후 '이' 또는 '가' 붙이기
function addSubjectParticle(name: string): string {
  if (!name) return '아이가'; // 이름 없으면 기본값
  const lastChar = name[name.length - 1];
  const code = lastChar.charCodeAt(0);

  // 한글 유니코드 범위인지 확인
  if (code < 0xac00 || code > 0xd7a3) return name + '가';

  const jong = (code - 0xac00) % 28; // 받침 계산
  return name + (jong === 0 ? '가' : '이');
}

// 한글 받침 확인 후 '은' 또는 '는' 붙이기
function addTopicParticle(name: string): string {
  if (!name) return '아이는'; // 이름 없으면 기본값
  const lastChar = name[name.length - 1];
  const code = lastChar.charCodeAt(0);

  // 한글 유니코드 범위인지 확인
  if (code < 0xac00 || code > 0xd7a3) return name + '는';

  const jong = (code - 0xac00) % 28; // 받침 계산
  return name + (jong === 0 ? '는' : '은');
}

const nameWithIga = addSubjectParticle(childname); // 이/가
const nameWithEunNeun = addTopicParticle(childname); // 은/는
  // --------------------------
  // 📌 props 기반 문장 생성
  // --------------------------
  const grapeCount = Math.floor(cumulativeAnswerCount / 6);
  const sentences: string[] = [
    // 누적 + 당일 포도송이
    !grapeCount || grapeCount === 0
      ? `${nameWithIga} 아직 포도송이를 수확하지 못했어요.`
      : `${nameWithEunNeun} 지금까지 총 ${grapeCount}송이의 포도송이를 모았어요! ${
          newGrape > 0
            ? `오늘은 ${newGrape}개의 포도송이를 수확했어요.`
            : `응원이 필요해요!`
        }`,

    // 가장 많이 이야기한 카테고리
    mostTalkedCategory
      ? `${nameWithIga} 가장 많이 이야기한 주제는 "${mostTalkedCategory}"예요.`
      : `아직 많이 이야기한 주제가 없어요.`,

    // 긍정 비율 높은 카테고리
    positiveCategory
      ? `긍정적인 표현이 가장 많았던 주제는 "${positiveCategory}"예요.`
      : `아직 긍정적인 주제가 두드러지지 않았어요.`,

    // 부정 비율 높은 카테고리
    negativeCategory
      ? `부정적인 표현이 가장 많았던 주제는 "${negativeCategory}"예요.`
      : `아직 특별히 부정적인 주제는 없어요.`,

    // 감정
    emotion
      ? `이번 달 ${nameWithIga} 가장 많이 선택한 감정 이모지는 "${emotion}"이에요.`
      : `${nameWithIga} 표현한 감정이 아직 없어요.`,
  ];

  const emojis = ['🍇', '🌱', '💬', '😊', '😟', '💖'];

  return (
    <div className="flex justify-center py-4">
      <div className="w-4/5 max-w-7xl bg-orange-300 p-10 overflow-hidden rounded-3xl shadow-lg">
        <div className="w-full mx-auto text-md space-y-2 flex flex-col items-center">
          {/* 배너 설명 멘트 */}
          <div className="bg-orange-100 h-1/2 max-w-5xl rounded-3xl flex justify-center items-center p-6 min-h-[3rem] mb-8">
            <div className="min-h-[2rem]">
              <h2 className="text-xl font-bold text-center text-gray-900 ">
                {displayedText}
              </h2>
            </div>
          </div>

          {/* 배너 요소 박스 */}
          <div className="flex flex-wrap justify-center gap-4">
            {sentences.map((text, index) => (
              <div
                key={index}
                className="bg-white px-4 py-2 rounded-xl shadow-md flex items-center border border-gray-200 max-w-xs break-words"
              >
                <span className="mr-2 text-2xl">{emojis[index % emojis.length]}</span>
                <span className="text-base font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
