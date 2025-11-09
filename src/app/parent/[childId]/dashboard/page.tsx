import { Fetcher } from '@/lib/fetcher';
import AiComment from './_components/AiComment';
import { ChildPageParams } from '@/types/page-props';
import NotFound from '@/components/Exception/not-found';
import PageLayout from '@/app/parent/[childId]/_components/Layout/ParentLayout';
import { Text } from '@/ui/Text';
import CumulateChart from '@/app/parent/[childId]/dashboard/_components/CumulateChart';
import CategoryRankChart from './_components/CategoryChart';
interface KeywordData {
  keywords: Keyword[]; // 키워드 배열
}

interface Keyword {
  keyword: string;
  count: number;
  positiveScore: number;
}

interface CumulativeData {
  cumulative: number; // 누적 응답 수
  cumList: number[]; // 일별 응답 수 (오늘 포함 7일)
}

export default async function DashBoardPage({ params }: ChildPageParams) {
  // params가 Promise이므로, await를 사용해 값을 추출
  const { childId } = await params;

  if (!childId) return <NotFound message="자녀 ID가 존재하지 않습니다." />;

  const keywordRes = await Fetcher<KeywordData>(`/parent/${childId}/keywords`);
  const keywordData = keywordRes.data;
  console.log('분석 /stat api 호출 ', keywordData);
  if (!keywordData) {
    return <div>분석 데이터 불러오기 실패...</div>;
  }

  const cumulativeRes = await Fetcher<CumulativeData>(
    `/parent/${childId}/stat/cumulative?periodType='day'`,
  );
  const cumulativeData = cumulativeRes.data;
  console.log('분석 /stat api 호출 ', cumulativeData);
  if (!cumulativeData) {
    return <div>분석 데이터 불러오기 실패...</div>;
  }

  const pageTitle = (
    <>
      <Text variant={'body03'} className="text-grayscale-gray60">
        2025년 11월 1일 업데이트됨
      </Text>
      <Text variant={'title01'}>
        {' '}
        아이가 자주 느낀
        <br />
        감정들을 들여다볼까요?
      </Text>
    </>
  );

  return (
    <PageLayout title={pageTitle}>
      {/* 헤더에 알림 개수 정보 전달 필요 */}
      <AiComment childId={childId} />

      <CumulateChart
        childId={childId}
        cumulative={cumulativeData.cumulative}
        defaultCumList={cumulativeData.cumList}
      />

         <CategoryRankChart keywords={keywordData.keywords} />
      
    </PageLayout>
  );
}
