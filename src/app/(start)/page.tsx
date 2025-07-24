'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Fetcher } from '@/lib/fetcher';
import LoginButton from '@/components/Auth/LoginButton';

import StartLogoCanvas from '@/components/Logo/StartLogoCanvas';

export default function StartPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const checkAccepted = async () => {
      if (session?.accessToken) {
        try {
          const result = await Fetcher<{ accepted: boolean }>('/start/login');
          if (result?.data?.accepted) {
            router.replace('/profile');
          }
        } catch {}
      }
    };

    checkAccepted();
  }, [session]);
  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      
      <div className="bg-orange-100 pb-52">
        
        {/* 오른쪽 상단 미니 로고 */}
        <div className="flex gap-1 mb-4 absolute right-24 top-8">
          <div className="bg-orange-300 px-4 py-1 rounded-full text-sm">
            2026
          </div>
          <div className="bg-i-lightgrey px-4 py-1 rounded-md text-sm">
            Team i-Bridge
          </div>
        </div>

        {/* 간격 */}
        <div className="mr-40 mt-8">
          <div className="flex gap-4 mb-4 "></div>
        </div>

        {/* 소개글 + 로그인 */}
        <section className="w-full px-6 mt-28">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-y-2 gap-x-12 max-w-5xl mx-auto items-center">
            {/* 왼쪽 텍스트 */}
            <div className="min-w-0 text-left text-gray-900">
              <h3 className="text-xl font-bold mb-4">Welcome to i-Bridge</h3>
              <p className="text-md mb-1">
                감정은 행동이 아닌, 말로 표현될 수 있어야 합니다.
              </p>
              <p className="text-sm mb-8">
                iBridge는 부모가 아이의 진짜 마음을 이해할 수 있도록 돕는, 사고
                분석 기반의 소통 플랫폼입니다.
              </p>
            </div>

            {/* 오른쪽 로그인 */}
            <div className="w-full md:w-[300px] max-w-[350px] flex justify-center mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 relative overflow-visible min-h-[200px] w-full">
                <div className="absolute inset-x-0 -top-[1px] -left-[1px] -right-[1px] rounded-tr-lg rounded-tl-lg h-2 bg-gradient-to-r from-i-lightorange to-i-orange"></div>
                <div className="space-y-3">
                  <LoginButton />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 🔽 아래쪽: 로고 캔버스 */}
      <div className="-mt-36 px-2 pb-10 flex justify-center">
        <div className="max-w-[800px] w-full">
          <StartLogoCanvas />
        </div>
      </div>

      {/* Intro Text Section */}
      <section className="max-w-5xl mx-auto px-16 mt-12 mb-32 relative text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
          부모와 자녀, 감정의 다리를 잇다
        </h1>
        <p className="text-lg text-gray-900 leading-relaxed mb-8">
          아이의 행동 이면에는 언제나 &quot;나를 이해해 줘!&quot;라는 외침이
          있습니다. 하지만 부모도 완벽할 수 없기에, 올바른 소통을 위한 도구가
          필요합니다. iBridge는 부모가 감정을 개입하지 않고 자녀의 속마음을
          이해할 수 있도록 도와주는 웹 플랫폼입니다.
        </p>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-12"
        >
          가족을 이해하는 새로운 방법, iBridge
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="bg-white p-6 rounded-xl shadow-md text-left"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              감정 중심의 대화 설계
            </h3>
            <p className=" text-gray-900">
              아이의 감정을 기반으로 설계된 질문으로, 더 깊은 생각을
              이끌어냅니다.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white p-6 rounded-xl shadow-md text-left"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              부모를 위한 인사이트
            </h3>
            <p className="text-blue-900">
              감정 해석 없이 자녀의 답변을 이해하고, 적절한 반응을 도와주는 분석
              결과 제공.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white p-6 rounded-xl shadow-md text-left"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              쉽고 직관적인 사용 경험
            </h3>
            <p className=" text-gray-900">
              누구나 이해하기 쉬운 UI/UX로, 기술에 익숙하지 않아도 걱정 없이
              사용 가능.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Parent and Child Service Sections */}
      <div className="w-full mx-auto px-32 mb-16">
        <div className="flex justify-between gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="w-full sm:w-[45%] bg-white p-6 rounded-lg shadow-md border border-gray-200"
          >
            <h2 className="text-4xl text-gray-900 font-bold mb-8">
              For Parent
            </h2>
            <p className=" text-gray-900 leading-relaxed mb-8">
              감정적인 해석을 최소화하고, 자녀의 생각을 보다 명확히 이해할 수
              있도록 돕는 인사이트 제공 서비스.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="w-full sm:w-[45%] bg-white p-6 rounded-lg shadow-md border border-gray-200"
          >
            <h2 className="text-4xl text-gray-900 font-bold mb-8">For Child</h2>
            <p className=" text-gray-900 leading-relaxed mb-8">
              귀여운 캐릭터와의 대화를 통해 자연스럽게 감정을 표현하고, 자신을
              이해받는 경험을 쌓을 수 있는 공간.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
