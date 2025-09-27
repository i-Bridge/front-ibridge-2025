import CumulateChart from '@/app/parent/[childId]/statistics/_components/CumulateChart';
import CategoryChart from '@/app/parent/[childId]/statistics/_components/CategoryChart';
import Calendar from '@/app/parent/[childId]/statistics/_components/Calendar';
import HomeHeader from '@/components/Header/HomeHeader';
import { ChildPageParams } from '@/types/page-props';
import { Fetcher } from '@/lib/fetcher';

interface StatisticData {
  name: string; // 자녀 이름
  signupDate: string; // 가입일
  cumulative: number; // 누적 응답 수
  emotions: string[]; // 감정 배열 (예: "JOY", "ANXIETY")
  cumList: number[]; // 일별 응답 수 (오늘 포함 7일)
  keywords: Keyword[]; // 키워드 배열
}

interface Keyword {
  keyword: string;
  count: number;
  positiveScore: number;
}

export default async function StatisticsPage({ params }: ChildPageParams) {
  const { childId } = await params;

  if (!childId) {
    return <div> 자녀 정보 없음 </div>;
  }

  const statisticRes = await Fetcher<StatisticData>(`/parent/${childId}/stat`);
  const statisticData = statisticRes.data;
  console.log('분석 /stat api 호출 ', statisticData);
  if (!statisticData) {
    return <div>분석 데이터 불러오기 실패...</div>;
  }

  return (
    <div>
      <HomeHeader childId={childId} />
      <div className="mt-10 p-4">
  {/* 감싸는 div: 최대 가로폭 + 가운데 정렬 */}
  <div className="max-w-7xl mx-auto w-full">
    <div className="flex flex-col md:flex-row gap-6 ">
      {/* 왼쪽: 내용 크기만큼 */}
      <div className="flex flex-col gap-6 items-center justify-center ml-6 mr-6 mt-16">
        <Calendar
          childId={childId}
          defaultemotions={statisticData.emotions}
          signupDate={statisticData.signupDate}
        />
        <div className="flex flex-col items-center border rounded p-4 space-y-4 ">
          <p className="text-sm text-gray-500">누적 응답 수</p>
          <p className="text-lg font-bold w-10 h-10 text-center rounded-full">
            {statisticData.cumulative}
          </p>
          <hr className="w-2/3 border-t border-gray-300" />
          <CumulateChart
            childId={childId}
            defaultCumList={statisticData.cumList}
          />
        </div>
      </div>

      {/* 오른쪽: 남은 공간 전부 차지 */}
      <div className="flex-1 flex flex-col gap-6 ml-20">
        <CategoryChart categories={statisticData.keywords} childname={statisticData.name} childId={childId} />
      </div>
    </div>
  </div>
</div>
</div>
  );
}
