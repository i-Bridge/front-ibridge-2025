'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import LoginButton from '@/components/Login/LoginButton';
import UserInfo from '@/components/Login/UserInfo';

export default function StartPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen">
      <header className="fixed top-0 left-0 right-0  bg-i-ivory bg-opacity-95 z-50 shadow-md">
        <nav className="max-w-7xl mx-auto px-8 py-3 flex justify-between items-center">
          <Image
            src="/images/logo.svg"
            alt="Logo"
            width={100} // 로고 크기도 줄일 수 있음
            height={100}
            className="mr-10"
          />
          <div className="flex gap-4">
            <a
              href="#faq"
              className="text-i-darkblue hover:text-i-pink transition-colors"
            >
              자주 묻는 질문
            </a>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-8 pt-24">
        <motion.section
          className="flex justify-between items-start mb-16 mt-12"
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          <div className="flex-1">
            <h2 className="text-6xl text-i-darkblue font-bold mb-4">
              Welcome to iBridge
            </h2>
            <p className="text-xl text-i-darkblue mb-8">
              Connecting parents and children for a brighter future
            </p>
            <div className="flex gap-4">
              <div className="bg-i-lightpurple text-blue-900 px-4 py-1 rounded-full text-sm">
                2023 Edition
              </div>
              <div className="bg-i-lightgrey text-blue-900 px-4 py-1 rounded-md text-sm">
                Graphic Designer
              </div>
            </div>
          </div>

          <div className="w-80">
            <div className="bg-white p-6 rounded-md shadow-md border border-gray-200 relative overflow-hidden">
              {/* 상단 데코 요소 */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-400 to-green-400"></div>

              <h3 className="text-gray-900 font-semibold mb-4 text-lg text-center">
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
        </motion.section>

        {/* Parent Service Section */}

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

        {/* Child Service Section */}
        <div className="max-w-3xl">
          <h2 className="text-4xl text-i-darkblue font-bold mb-8">For Child</h2>
          <p className="text-blue-900 leading-relaxed mb-8">
            아이들을 위한 특별한 서비스입니다. 재미있는 활동과 교육적인 콘텐츠로
            즐겁게 배우고 성장할 수 있습니다.
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

        <motion.section
          id="faq"
          className="mb-16 bg-white rounded-3xl p-12 shadow-lg"
          initial="hidden"
          animate={scrollY > 1000 ? 'visible' : 'hidden'}
          variants={sectionVariants}
        >
          <div className="max-w-3xl">
            <h2 className="text-4xl text-i-darkblue font-bold mb-8 ">
              자주 묻는 질문
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'iBridge는 어떤 서비스인가요?',
                  a: 'iBridge는 부모와 자녀를 연결하는 육아 도움 플랫폼입니다.',
                },
                {
                  q: '어떤 연령대의 아이들에게 적합한가요?',
                  a: 'iBridge는 3세부터 12세까지의 아이들을 위해 설계되었습니다.',
                },
                {
                  q: '서비스 이용 요금은 어떻게 되나요?',
                  a: '기본 서비스는 무료이며, 프리미엄 기능은 월 구독제로 제공됩니다.',
                },
              ].map((item, index) => (
                <details key={index} className="bg-i-lightgrey rounded-lg p-4">
                  <summary className="font-semibold text-i-darkblue cursor-pointer">
                    {item.q}
                  </summary>
                  <p className="mt-2 text-blue-900">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </motion.section>
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
