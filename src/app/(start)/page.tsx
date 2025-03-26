'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import LoginButton from '@/components/Login/LoginButton';

export default function StartPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-i-ivory py-24 px-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex-1">
              <h2 className="text-6xl text-i-darkblue font-bold mb-4">
                Welcome to iBridge
              </h2>
              <p className="text-xl text-i-darkblue mb-8">
                Connecting parents and children for a brighter future
              </p>
              <div className="flex gap-4">
                <div className="bg-i-lightpurple text-blue-900 px-4 py-1 rounded-full text-sm">
                  2026
                </div>
                <div className="bg-i-lightgrey text-blue-900 px-4 py-1 rounded-md text-sm">
                  Team i-Bridge
                </div>
              </div>
            </div>

            <div className="w-80">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-i-lightpurple to-i-pink"></div>
                <h3 className="text-i-darkblue font-semibold mb-4 text-lg text-center">
                  소셜 로그인
                </h3>
                <p className="text-gray-500 text-sm text-center mb-4">
                  간편하게 로그인하고 서비스를 이용하세요.
                </p>
                <div className="space-y-3">
                  <LoginButton />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-16 mb-32 relative">
          {/* 배경 이미지 및 투명 오버레이 */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat "
            style={{
              backgroundImage: 'url(/images/background.jpg)',
            }}
          >
            {/* 배경 투명도 오버레이 (이미지 위에만 적용) */}
            <div className="absolute inset-0 bg-i-ivory opacity-70"></div>
          </div>

          {/* 텍스트 영역 (배경 없음) */}
          <div className="relative py-16 px-8">
            <h1 className="text-2xl font-bold text-center text-i-darkblue mb-8">
              iBridge: 부모와 아이들이 함께 성장하다
            </h1>
            <p className="text-lg text-center text-i-darkblue leading-relaxed mb-8">
              iBridge는 부모님을 위한 체계적인 관리 도구와 아이들을 위한
              재미있는 학습 활동을 통해 가족 간의 유대감을 높이고, 보다 나은
              미래를 위한 환경을 조성합니다. 지금 iBridge와 함께 새로운 경험을
              시작하세요. 현대 사회에서 부모와 자녀 간의 소통 부족이 큰 문제로
              대두되고 있습니다. 특히 맞벌이 가정 증가로 인해 대화 시간이
              줄어들고 있으며, 부모는 자녀의 심리 상태를 이해하기 어려워~~하는
              경우가 많습니다. 부모가 자녀에게 적절한 질문을 하고 이를 통해
              자녀의 정서와 사고 능력을 파악하는 것은 중요한 육아 과정 중
              하나입니다. 하지만 바쁜 일상 속에서 이를 체계적으로 관리하기
              어려운 경우가 많습니다. iBridge는 이러한 문제를 해결하기 위해
              인공지능을 활용하여 자녀의 감정을 분석하고 부모에게 인사이트를
              제공하는 플랫폼입니다. 부모가 직접 묻기 어려운 질문을 iBridge에
              입력하면, 귀여운 캐릭터가 자녀용 앱에서 대신 질문을 던지는
              방식으로 운영됩니다. 이를 통해 자녀는 자연스럽게 캐릭터와 대화하는
              것처럼 느껴 부담 없이 자신의 생각을 표현할 수 있으며 부모는 자녀의
              깊은 속마음을 보다 쉽게 이해할 수 있습니다.
            </p>
          </div>
        </div>

        {/* Parent and Child Service Sections */}

        <div className="w-full mx-auto px-8 mb-16 ">
          <div className="flex justify-between gap-12">
            <div className="w-full sm:w-[45%] bg-white p-6 rounded-lg shadow-md border border-gray-200 relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-i-lightpurple to-i-pink"></div>
              <h2 className="text-4xl text-i-darkblue font-bold mb-8">
                For Parent
              </h2>
              <p className="text-blue-900 leading-relaxed mb-8">
                부모님을 위한 서비스를 소개하는 섹션입니다. 아이의 성장과 발달을
                체계적으로 관리하고 모니터링할 수 있는 다양한 기능을 제공합니다.
              </p>
              <div className="grid grid-cols-1 gap-4">
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
                    className={`bg-i-${['lightgreen', 'yellow', 'lightpurple', 'skyblue', 'lightgrey', 'pink'][index]} 
                    text-blue-900 rounded-full px-6 py-3 text-center font-medium hover:transform hover:scale-105 transition-transform`}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full sm:w-[45%] bg-white p-6 rounded-lg shadow-md border border-gray-200 relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-i-lightpurple to-i-pink"></div>
              <h2 className="text-4xl text-i-darkblue font-bold mb-8">
                For Child
              </h2>
              <p className="text-blue-900 leading-relaxed mb-8">
                아이들을 위한 특별한 서비스입니다. 재미있는 활동과 교육적인
                콘텐츠로 즐겁게 배우고 성장할 수 있습니다.
              </p>
              <div className="grid grid-cols-1 gap-4">
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
                    className={`bg-i-${['lightgreen', 'yellow', 'lightpurple', 'skyblue', 'white', 'pink'][index]} 
                    text-blue-900 rounded-full px-6 py-3 text-center font-medium hover:transform hover:scale-105 transition-transform`}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-i-orange text-white py-8">
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          <p>© 2025 iBridge. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-i-pink transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-i-pink transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-i-pink transition-colors">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
