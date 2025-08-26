import CumulateChart from '@/app/parent/[childId]/statistics/_components/CumulateChart';
import KeywordChart from '@/app/parent/[childId]/statistics/_components/KeywordChart';
import Calendar from '@/app/parent/[childId]/statistics/_components/Calendar';
import HomeHeader from '@/components/Header/HomeHeader';
import { ChildPageParams } from '@/types/page-props';
import { Fetcher } from '@/lib/fetcher';

interface StatisticData {
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
  console.log("로그 찍기",statisticData);
  if (!statisticData) {
    return <div>분석 데이터 불러오기 실패...</div>;
  }

  return (
    <div>
      <HomeHeader childId={childId} />
      <div className="mt-20 p-4">
        {/* 그리드: 기본 2열, 화면 작아지면 1열 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 왼쪽: 달력 + 누적 데이터 */}
          <div className="flex flex-col gap-6 items-center justify-center">
            <Calendar childId={childId} defaultemotions={statisticData.emotions}/>
            <p className="text-sm text-gray-500">누적 응답 수</p>
            <p className="text-lg font-bold">{statisticData.cumulative}</p>
            <CumulateChart childId={childId} defaultCumList={statisticData.cumList}/>
          </div>

          {/* 오른쪽: 키워드 파이차트 */}
          <div className="flex flex-col gap-6">
            <KeywordChart />
          </div>
        </div>
      </div>
    </div>
  );
}
