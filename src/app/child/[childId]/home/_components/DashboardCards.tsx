'use client';

type Props = {
  emotionDone: boolean;
  rewardAvailable: boolean;
};

export default function DashboardCards({
  emotionDone,
  rewardAvailable,
}: Props) {
  const today = new Date();
  const formattedDate = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* 감정 상태 카드 */}
      <div className="bg-secondary/10 h-[284px] rounded-[40px] shadow-lg py-10 px-12 flex flex-col justify-between gap-10">
        {/* 상단 텍스트 영역 */}
        <div className="w-full flex flex-col gap-5">
          <div className="flex items-center gap-5">
            {/* 감정 이모지/아이콘 영역 */}
            <div className="w-[100px] h-[100px] bg-white rounded-full flex-shrink-0 flex items-center justify-center text-5xl">
              🍀
            </div>
            {/* 텍스트 그룹 */}
            <div className="flex flex-col gap-2">
              <p className="text-lg font-bold leading-[140%] text-gray-500">
                {formattedDate}
              </p>
              <p className="text-2xl font-bold text-gray-800">
                오늘은 <span className="text-green-600">네잎클로버</span> 같은
                날이야
              </p>
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <button
          disabled={emotionDone}
          // ✅ [수정] 배경색 투명도(bg-secondary/40) 대신, 버튼 전체의 투명도(opacity-40)를 적용합니다.
          className="w-full h-16 rounded-full bg-secondary flex items-center justify-center py-5 px-10 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
        >
          <div className="w-full h-8 flex items-center justify-center">
            <p className="text-xl font-extrabold leading-[160%] text-gray-90">
              {emotionDone ? '감정 선택 완료' : '감정 선택하기'}
            </p>
          </div>
        </button>
      </div>

      {/* 보상 카드 */}
      <div className="bg-purple-100 h-[284px] rounded-[40px] shadow-lg p-10 px-12 flex flex-col justify-between gap-10">
        <div>
          <p className="text-xl font-bold text-gray-800">
            지금 바로 <br /> 포도송이 1송이를 받을 수 있어!
          </p>
        </div>
        <div className="flex gap-4">
          <button
            disabled={!rewardAvailable}
            className="flex-1 py-3 bg-purple-300 text-purple-800 rounded-lg font-semibold disabled:bg-purple-200 disabled:text-purple-600 transition-colors"
          >
            한 송이 받기
          </button>
          <button
            disabled
            className="flex-1 py-3 bg-gray-200 text-gray-500 rounded-lg font-semibold cursor-not-allowed"
          >
            상점 준비중
          </button>
        </div>
      </div>
    </div>
  );
}
