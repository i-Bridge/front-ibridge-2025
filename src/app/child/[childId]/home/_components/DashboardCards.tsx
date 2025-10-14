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
      <div className="bg-yellow-50 h-[284px] rounded-[40px] shadow-lg p-10 px-12 flex flex-col justify-between gap-10">
        <div>
          <p className="text-sm text-gray-500">{formattedDate}</p>
          <p className="mt-2 text-xl font-bold text-gray-800">
            오늘은 <span className="text-green-600">네잎클로버</span> 같은
            날이야
          </p>
        </div>
        <button
          disabled={emotionDone}
          className="w-full py-3 bg-yellow-200 text-yellow-800 rounded-lg font-semibold disabled:bg-yellow-100 disabled:text-yellow-600 transition-colors"
        >
          {emotionDone ? '감정 선택 완료' : '오늘의 감정 선택하기'}
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
