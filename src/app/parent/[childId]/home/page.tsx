// src/app/parent/home/page.tsx
import HomeHeader from '@/components/Header/HomeHeader';
import Weekly from '@/components/Home/weekly';
import MonthSelector from '@/components/Home/monthSelector';
import AIComment from '../../../../components/Home/aiComment';
import DailyQuestionList from '@/components/Question/DailyQuestionList'; // DailyQuestionList 컴포넌트 import
//슬라이딩
type PageProps = {
  params: {
    childId: string;
  };
};

export default async function HomePage({ params }: PageProps) {
  const { childId } = params; // URL에서 [childid]를 가져옴. type은 string
  return (
    <div>
      <HomeHeader childId={childId} />
      <div className="flex flex-col justify-center items-center w-full pt-3">
        <AIComment />
        <div className="  pt-4">
          <MonthSelector />
          <Weekly />
        </div>

        <div className="mt-4">
          <DailyQuestionList />
        </div>
      </div>
    </div>
  );
}
