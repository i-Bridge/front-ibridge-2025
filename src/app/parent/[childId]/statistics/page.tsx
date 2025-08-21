import CumulateChart from '@/components/Statistic/cumulateChart';
import KeywordChart from '@/components/Statistic/keywordChart';
import Calendar from '@/components/Statistic/calendar';
import HomeHeader from '@/components/Header/HomeHeader';
import { ChildPageParams } from '@/types/page-props';

export default async function StatisticsPage({ params }: ChildPageParams) {
  const { childId } = await params;

  if (!childId) {
    return <div> 자녀 정보 없음 </div>;
  }

  return (
    <div>
      <HomeHeader childId={childId} />
      <div className="mt-20 p-4">
        {/* 그리드: 기본 2열, 화면 작아지면 1열 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 왼쪽: 달력 + 누적 데이터 */}
          <div className="flex flex-col gap-6 items-center justify-center">
            <Calendar />
            <CumulateChart />
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
