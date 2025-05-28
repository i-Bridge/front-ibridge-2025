'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { Fetcher } from '@/lib/fetcher';
import LoginButton from '@/components/Auth/LoginButton';

const imageNames = ['i_green', 'B', 'r', 'i', 'd', 'g', 'e'];

const imagePositions = [
  { xStart: 60, xEnd: 100, yStart: 150, yEnd: 90 }, //i
  { xStart: 160, xEnd: 170, yStart: -20, yEnd: 90 }, //B
  { xStart: 230, xEnd: 305, yStart: 110, yEnd: 90 },  //r
  { xStart: 320, xEnd: 400, yStart: 0, yEnd: 90 },   //i
  { xStart: 400, xEnd: 450, yStart: 40, yEnd: 90 },  //d
  { xStart: 490, xEnd: 560, yStart: 170, yEnd: 120 }, //g
  { xStart: 630, xEnd: 660, yStart: -10, yEnd: 90 }, //e
];

const imageSizes = [
  { width: 60, height: 160 },
  { width: 140, height: 200 },
  { width: 100, height: 120 },
  { width: 60, height: 160 },
  { width: 140, height: 180 },
  { width: 160, height: 160 },
  { width: 190, height: 120 },
];

export default function StartPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const containerRef = useRef(null);
  const { scrollY } = useScroll();

  const [transforms, setTransforms] = useState<{ x: number; y: number }[]>([]);


  useEffect(() => {
    const calculateTransforms = () => {
      const calculatedTransforms = imagePositions.map(
        ({ xStart, xEnd, yStart, yEnd }) => {
          // 스크롤 값에 따라 위치 변환
          const x = (scrollY.get() / 1000) * (xEnd - xStart) + xStart; // x 이동
          const y = (scrollY.get() / 1000) * (yEnd - yStart) + yStart; // y 이동
          return { x, y };
        },
      );
      setTransforms(calculatedTransforms); // 상태에 변환된 x, y 값을 저장
    };

    calculateTransforms(); // 처음 로드 시 변환값 계산
    const unsubscribe = scrollY.onChange(calculateTransforms); // 스크롤 변화 시 계산

    return () => unsubscribe(); // 컴포넌트 언마운트 시 정리
  }, [scrollY]);

  useEffect(() => {
    const checkAccepted = async () => {
      if (session?.accessToken) {
        try {
          const result = await Fetcher<{ accepted: boolean }>('/start/login');
          if (result?.data?.accepted) {
            router.replace('/profile');
          }
        } catch (e) {
          // 첫 로그인 유저는 여기서 에러 발생할 수 있음 → 무시하고 LoginButton 진행
        }
      }
    };

    checkAccepted();
  }, [session]);
  return (
    <div
      ref={containerRef}
      className="min-h-screen flex flex-col relative  overflow-hidden"
    >
      <div className="bg-orange-100 ">

        <div className="flex gap-1 mb-4 absolute right-24 top-8">
          <div className="bg-orange-300  px-4 py-1 rounded-full text-sm">
            2026
          </div>
          <div className="bg-i-lightgrey  px-4 py-1 rounded-md text-sm">
            Team i-Bridge
          </div>
        </div>
    <div className="mr-40 mt-8">
<div className="flex gap-4 mb-4 ">
          
        </div>
        </div>
        

        
    {/* ✅ 1. 위쪽: 로고 + 로그인 버튼 영역 */}
    <section className="w-full  px-16 mt-36 mb-8 ml-250">
      <div className="max-w-7xl mx-auto flex justify-between items-center ml-20 ">
          {/* 상단 이미지 애니메이션 패널 */}
    <div className=" mt-[-24]">
      {imageNames.map((name, idx) => (
        <motion.img
  key={idx}
  src={`/images/${name}.png`}
  alt={`img-${idx}`}
  initial={{
    x: imagePositions[idx].xStart,
    y: imagePositions[idx].yStart - imageSizes[idx].height,
    opacity: 0, // ⬅ 초기에는 투명
  }}
  animate={{
    x: imagePositions[idx].xEnd,
    y: imagePositions[idx].yEnd - imageSizes[idx].height,
    opacity: 1, // ⬅ 애니메이션 도착 시 나타남
  }}
  transition={{
    type: 'spring',
    stiffness: 50,
    damping: 12,
    opacity: { duration: 1.2 }, // ⬅ opacity 변화는 좀 더 부드럽게
  }}
  className="absolute z-10 object-contain"
  style={{
    width: `${imageSizes[idx].width}px`,
    height: `${imageSizes[idx].height}px`,
  }}
/>

      ))}
    </div>
        {/* 오른쪽: 로그인 박스 */}
        <div className="w-80  ">
          <div className="bg-white  p-6 rounded-lg shadow-md border border-gray-200 relative overflow-visible min-h-[200px]">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-i-lightorange to-i-orange"></div>
            <div className="space-y-3 ">
              <LoginButton />
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ✅ 2. 아래쪽: 텍스트 소개 섹션 */}
    <section className="flex-1 px-6 pb-5 ml-[-120]">
      <div className="max-w-4xl mx-auto text-gray-600">
        <h2 className="text-xl  font-bold mb-4">
          Welcome to i-Bridge
        </h2>
        <p className="text-md  mb-1">
          감정은 행동이 아닌, 말로 표현될 수 있어야 합니다.
        </p>
        <p className="text-sm  mb-8">
          iBridge는 부모가 아이의 진짜 마음을 이해할 수 있도록 돕는, 감정
          분석 기반의 소통 플랫폼입니다.
        </p>
        
      </div>
    </section>
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
                감정 해석 없이 자녀의 답변을 이해하고, 적절한 반응을 도와주는
                분석 결과 제공.
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
              <h2 className="text-4xl text-gray-900 font-bold mb-8">
                For Child
              </h2>
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
