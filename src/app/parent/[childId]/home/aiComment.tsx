const mockupData = [
    "아이가 최근 친구들과 조금 거리를 두고 혼자 있는 시간을 선호하고 있어요.",
    "학교에서 피곤해하고 집에 오면 쉬고 싶어하는 경향이 있어요.",
    "마음이 복잡할 때 아무것도 하지 않고 멍하니 있는 걸로 마음을 진정시켜요.",
    "최근 집중력이 떨어져 공부에 어려움을 겪고 있지만, 계속해서 노력하고 있어요.",
    "오늘은 친구와 즐겁게 놀면서 기분이 많이 좋아졌어요."
  ];
  export default function AiComment() {
    const emojiData = [
      "🙂", // 첫 번째 문장 - 아이가 혼자 있는 시간을 선호하는 상태
      "😴", // 두 번째 문장 - 피곤해하고 쉬고 싶어하는 상태
      "🤔", // 세 번째 문장 - 마음이 복잡할 때 멍하니 있는 상태
      "📚", // 네 번째 문장 - 공부에 어려움을 겪고 있지만 노력하는 상태
      "😄"  // 다섯 번째 문장 - 친구와 즐겁게 놀면서 기분이 좋아진 상태
    ];
  
    return (
      <div className="w-full bg-i-lightorange py-12">
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
  