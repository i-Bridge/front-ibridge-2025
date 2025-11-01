import { Fetcher } from '@/lib/fetcher';
import AiComment from './_components/AiComment';
import { ChildPageParams } from '@/types/page-props';
import NotFound from '@/components/Exception/not-found';
import { Subject } from '@/types/index';
import PageLayout from '@/app/parent/[childId]/_components/Layout/ParentLayout';
import { Text } from '@/ui/Text';
import CumulateChart from '@/app/parent/[childId]/dashboard/_components/CumulateChart';
import CategoryChart from './_components/CategoryChart';
interface HomeData {
  hasNext: boolean;
  subjects: Subject[];
}

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

  const homeRes = await Fetcher<HomeData>(`/parent/${childId}/home`);

  if (!homeRes || !homeRes.data) {
    return <NotFound message="데이터를 불러오지 못했습니다." />;
  }

  const homeData = homeRes.data;

  if (!homeData) {
    return <NotFound message="데이터가 존재하지 않습니다." />;
  }
  console.log('/home', homeData);

  const keywordRes = await Fetcher<KeywordData>(`/parent/${childId}/keywords`);
    const keywordData = keywordRes.data;
    console.log('분석 /stat api 호출 ', keywordData);
    if (!keywordData) {
      return <div>분석 데이터 불러오기 실패...</div>;
    }

    
  const cumulativeRes = await Fetcher<CumulativeData>(`/parent/${childId}/stat/cumulative?periodType='day'`);
    const cumulativeData = cumulativeRes.data;
    console.log('분석 /stat api 호출 ', cumulativeData);
    if (!cumulativeData) {
      return <div>분석 데이터 불러오기 실패...</div>;
    }


  const pageTitle = (
    <div className="self-stretch px-10 pt-14 pb-5 inline-flex flex-col justify-start items-start gap-3">
      <Text variant={'body03'} className='text-grayscale-gray60'>
        2025년 11월 1일 업데이트됨
      </Text>
      <Text variant={'title01'}> 아이가 자주 느낀<br/>감정들을 들여다볼까요?</Text>
      
    </div>
  );


  return (
    <PageLayout title={pageTitle}>
      {/* 헤더에 알림 개수 정보 전달 필요 */}
          <AiComment childId={childId}
          />

          <CumulateChart
                      childId={childId}
                      cumulative={cumulativeData.cumulative}
                      defaultCumList={cumulativeData.cumList}
                    />
                    <div className="flex-1 flex flex-col gap-6 ml-20">
                            <CategoryChart categories={keywordData.keywords} childId={childId} />
                          </div>

    </PageLayout>
  );
}
