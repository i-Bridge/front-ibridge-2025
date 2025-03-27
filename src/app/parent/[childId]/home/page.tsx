// src/app/parent/home/page.tsx
import Weekly from '@/components/Home/weekly';
import DateSelector from '@/components/Home/monthSelector';
import AIComment from '../../../../components/Home/aiComment';
import DailyQuestionList from '@/components/Question/DailyQuestionList'; // DailyQuestionList 컴포넌트 import
//슬라이딩

export default function HomePage() {
  return (
    <div className="flex flex-col justify-center items-center w-full pt-3">
      <AIComment />
      <div className="  pt-4">
        <DateSelector />
        <Weekly />
      </div>

      <div className="mt-4">
        <DailyQuestionList />
      </div>
    </div>
  );
}
