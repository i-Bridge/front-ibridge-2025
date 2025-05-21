const mockupData = [
    "최근 아이는 슬라임에 관심이 많으며, 다양한 재료를 섞어보는 것을 즐기고 있습니다.",

"아이의 장래 희망은 우주 비행사이며, 우주에 가보고 싶은 이유를 이야기했습니다.",

"요즘 가장 좋아하는 놀이는 블록 쌓기이며, 더 높은 구조물을 만들고 싶어 합니다.",

"최근 관심 있는 주제는 공룡이며, 티라노사우루스에 대해 더 많이 알고 싶어 합니다.",

"아이에게 ‘세상에서 가장 좋아하는 음식’을 물어보았을 때, 초코 아이스크림이라고 답했습니다."
  ];
  export default function AiComment() {
    const emojiData = [
      "🙂", // 첫 번째 문장 - 아이가 혼자 있는 시간을 선호하는 상태
      "🙂", // 두 번째 문장 - 피곤해하고 쉬고 싶어하는 상태
      "🤔", // 세 번째 문장 - 마음이 복잡할 때 멍하니 있는 상태
      "📚", // 네 번째 문장 - 공부에 어려움을 겪고 있지만 노력하는 상태
      "😄"  // 다섯 번째 문장 - 친구와 즐겁게 놀면서 기분이 좋아진 상태
    ];
  
    return (
      <div className="w-full bg-i-ivory py-14">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-start gap-4 mb-4">
            {mockupData.slice(0, 2).map((text, index) => (
              <div key={index} className="bg-white p-4 rounded-xl shadow-md w-max flex items-center">
                <span className="mr-2 text-2xl">{emojiData[index]}</span>
                {text}
              </div>
            ))}
          </div>
          <div className="flex justify-start gap-4">
            {mockupData.slice(2).map((text, index) => (
              <div key={index} className="bg-white p-4 rounded-xl shadow-md w-max flex items-center">
                <span className="mr-2 text-2xl">{emojiData[index + 2]}</span>
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  