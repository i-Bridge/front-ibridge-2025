'use client';
const mockupData = [
  '최근 아이는 슬라임에 관심이 많으며, 다양한 재료를 섞어보는 것을 즐기고 있습니다.',

  '아이의 장래 희망은 우주 비행사이며, 우주에 가보고 싶은 이유를 이야기했습니다.',

  '요즘 가장 좋아하는 놀이는 블록 쌓기이며, 더 높은 구조물을 만들고 싶어 합니다.',

  '최근 관심 있는 주제는 공룡이며, 티라노사우루스에 대해 더 많이 알고 싶어 합니다.',

  '아이에게 ‘세상에서 가장 좋아하는 음식’을 물어보았을 때, 초코 아이스크림이라고 답했습니다.',
];
export default function AiComment() {
  const emojiData = [
    '🙂', // 첫 번째 문장 - 아이가 혼자 있는 시간을 선호하는 상태
    '🙂', // 두 번째 문장 - 피곤해하고 쉬고 싶어하는 상태
    '🤔', // 세 번째 문장 - 마음이 복잡할 때 멍하니 있는 상태
    '📚', // 네 번째 문장 - 공부에 어려움을 겪고 있지만 노력하는 상태
    '😄', // 다섯 번째 문장 - 친구와 즐겁게 놀면서 기분이 좋아진 상태
  ];

  const upperData = mockupData.slice(0, 2);
  const lowerData = mockupData.slice(2);
  const renderRepeated = (
    data: string[],
    emojis: string[],
    heightClass: string,
  ) =>
    [...data, ...data].map((text, index) => (
      <div
        key={index}
        className={`bg-white px-4 py-2 rounded-xl shadow-md w-max flex items-center mx-2 whitespace-nowrap border border-gray-200 ${heightClass}`}
      >
        <span className="mr-2 text-2xl">{emojis[index % emojis.length]}</span>
        <span className="text-base font-medium">{text}</span>
      </div>
    ));

  return (
    <div className="w-full bg-i-ivory py-14 overflow-hidden">
      <div className="w-full mx-auto text-md space-y-6">
        {/* 윗줄 */}
        <div className="relative w-full overflow-hidden h-20">
          <div className="scroll-container scroll-slow h-full flex items-center px-2">
            {renderRepeated(upperData, emojiData, 'h-20')}
          </div>
        </div>

        {/* 아랫줄 */}
        <div className="relative w-full overflow-hidden h-40 ">
          <div className="scroll-container scroll-fast h-full flex items-center px-2">
            {renderRepeated(lowerData, emojiData.slice(2), 'h-40')}
          </div>
        </div>
      </div>

      {/* 👇 내부 style 처리 (글로벌 X) */}
      <style jsx>{`
        @keyframes scrollSlow {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes scrollFast {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .scroll-slow {
          animation: scrollSlow 20s linear infinite;
        }

        .scroll-fast {
          animation: scrollFast 10s linear infinite;
        }
      `}</style>
    </div>
  );
}
