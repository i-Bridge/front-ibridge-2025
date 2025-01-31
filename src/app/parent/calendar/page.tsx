// app/parent/calendar/page.tsx

// app/parent/calendar/page.tsx
import Calendar from './calendar';

// 동적 import로 CSR 컴포넌트 불러오기 (클릭 이벤트 전용)
//const CalendarClient = dynamic(() => import('./calendar'), { ssr: false });

export default function CalendarPage() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 현재 월 (0: 1월, 11: 12월)
  
  // 해당 월의 첫째 날과 마지막 날짜 계산
  const firstDay = new Date(year, month, 1).getDay(); // 0: 일요일 ~ 6: 토요일
  const lastDate = new Date(year, month + 1, 0).getDate(); // 해당 월의 마지막 날짜

  // 빈 칸(이전 달 부분) + 날짜 배열 생성
  const days = Array.from({ length: firstDay }, () => null).concat(
    Array.from({ length: lastDate }, (_, i) => i + 1)
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen p-6 gap-4">
      {/* SSR 달력 UI */}
      <div className="w-full md:w-1/2 lg:w-1/3 p-4 bg-gray-100 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">{year}년 {month + 1}월 📅</h2>
        <div className="grid grid-cols-7 gap-2">
        
          {/* 요일 표시 */}
          {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
            <div key={day} className="text-center font-medium text-gray-600">{day}</div>
          ))}

          {/* 해당 월 날짜 UI */}
          {days.map((day, i) => (
            <div key={i} className={`w-10 h-10 flex items-center justify-center rounded-md shadow-sm 
              ${day ? 'bg-white text-gray-800' : 'bg-transparent'}`}>
              {day || ''}
            </div>
          ))}
        </div>
        
        {/* 동적 CalendarClient 추가 */}
        <Calendar />
      </div>

      {/* 통계 그래프 */}
      <div className="w-full md:w-1/2 lg:w-2/3 p-4 bg-gray-100 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">📊 Statistics</h2>
        {/* 나중에 통계 그래프 컴포넌트 추가 */}
      </div>
    </div>
  );
}

