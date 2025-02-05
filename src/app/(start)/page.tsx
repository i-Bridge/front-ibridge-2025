export default function StartPage() {
  return (
    <div className="min-h-screen bg-i-ivory px-8 py-12">
      <main className="max-w-7xl mx-auto">
        {/* Header Section with Logo and Social Login */}
        <div className="flex justify-between items-start mb-16">
          {/* Logo Section */}
          <div className="flex-1">
            <div className="relative">
              <h1 className="text-7xl text-i-pink font-bold mb-4 relative z-10">
                iBridge
                <span className="absolute -top-2 -right-2 text-xl text-i-skyblue">
                  ★
                </span>
              </h1>
              <h1 className="text-6xl text-i-darkblue font-bold mb-4">
                Start Page
              </h1>
              <h1 className="text-6xl text-i-darkblue font-bold mb-4">
                스크롤 내릴 때 애니메이션 효과(로고플레이)
              </h1>

              <div className="flex gap-4 mt-8">
                <div className="bg-i-lightpurple text-blue-900 px-4 py-1 rounded-full text-sm">
                  2023 Edition
                </div>
                <div className="bg-i-lightgrey text-blue-900 px-4 py-1 rounded-md text-sm">
                  Graphic Designer
                </div>
              </div>
            </div>
          </div>

          {/* Social Login Section */}
          <div className="w-80">
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-i-darkblue font-bold mb-4 text-xl">
                소셜 로그인
              </h3>
              <div className="space-y-3">
                <button className="w-full bg-[#4285F4] text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-[#357ABD] transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                    />
                  </svg>
                  Google 로그인
                </button>
                <button className="w-full bg-[#FAE100] text-[#391B1B] py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-[#FDD835] transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,20c-4.41,0-8-3.59-8-8s3.59-8,8-8s8,3.59,8,8S16.41,20,12,20z"
                    />
                  </svg>
                  카카오 로그인
                </button>
                <button className="w-full bg-[#03C75A] text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-[#02B150] transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M16,2H8C4.691,2,2,4.691,2,8v13c0,0.553,0.447,1,1,1h13c3.309,0,6-2.691,6-6V8C22,4.691,19.309,2,16,2z M20,16c0,2.206-1.794,4-4,4H4V8c0-2.206,1.794-4,4-4h8c2.206,0,4,1.794,4,4V16z"
                    />
                  </svg>
                  네이버 로그인
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Parent Service Section */}
        <div className="mb-16 bg-white rounded-3xl p-12 shadow-lg">
          <div className="max-w-3xl">
            <h2 className="text-4xl text-i-darkblue font-bold mb-8">
              For Parent
            </h2>
            <p className="text-blue-900 leading-relaxed mb-8">
              부모님을 위한 서비스를 소개하는 섹션입니다. 아이의 성장과 발달을
              체계적으로 관리하고 모니터링할 수 있는 다양한 기능을 제공합니다.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                '성장기록',
                '일정관리',
                '건강체크',
                '교육정보',
                '상담서비스',
                '커뮤니티',
              ].map((item, index) => (
                <div
                  key={index}
                  className={`
                  bg-i-${['lightgreen', 'yellow', 'lightpurple', 'skyblue', 'lightgrey', 'pink'][index]} 
                  text-blue-900 rounded-full px-6 py-3 text-center font-medium hover:transform hover:scale-105 transition-transform
                `}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Child Service Section */}
        <div className="mb-16 bg-i-lightgrey rounded-3xl p-12">
          <div className="max-w-3xl">
            <h2 className="text-4xl text-i-darkblue font-bold mb-8">
              For Child
            </h2>
            <p className="text-blue-900 leading-relaxed mb-8">
              아이들을 위한 특별한 서비스입니다. 재미있는 활동과 교육적인
              콘텐츠로 즐겁게 배우고 성장할 수 있습니다.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                '학습게임',
                '창작활동',
                '운동기록',
                '독서일기',
                '친구만들기',
                '보상시스템',
              ].map((item, index) => (
                <div
                  key={index}
                  className={`
                  bg-i-${['lightgreen', 'yellow', 'lightpurple', 'skyblue', 'white', 'pink'][index]} 
                  text-blue-900 rounded-full px-6 py-3 text-center font-medium hover:transform hover:scale-105 transition-transform
                `}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 자주묻는질문 */}
        <div className="mb-16 bg-white rounded-3xl p-12">
          <div className="max-w-3xl">
            <h2 className="text-4xl text-i-darkblue font-bold mb-8">
              자주 묻는 질문
            </h2>
            <p className="text-blue-900 leading-relaxed mb-8">
              자주 묻는 질문이 게시판 형태로 나열되어 있는 섹션입니다.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
