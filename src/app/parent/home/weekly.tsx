// src/app/parent/home/weekly.tsx
// 일주일치 버튼, 데이터에 따른 버튼 모양
export default function Weekly() {
    return (
      <div className="w-[600px] h-20 bg-beige-200 rounded-lg shadow-md overflow-hidden">
        <div className="w-full h-full overflow-x-auto whitespace-nowrap flex items-center px-4 scrollbar-hide">
          <div className="flex space-x-4 w-max">
            {Array.from({ length: 20 }).map((_, index) => (
              <button
                key={index}
                className="w-12 h-12 flex items-center justify-center bg-blue-500 text-white rounded-full shadow-md"
              >
                {index + 1}
              </button>
            ))}
          </div>
          <div className="bg-red-500 text-white p-4">Tailwind 테스트</div>
        </div>
      </div>
    );
  }
  
  