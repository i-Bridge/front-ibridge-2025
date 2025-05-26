'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { Fetcher } from '@/lib/fetcher';
import LoginButton from '@/components/Auth/LoginButton';

const imageNames = ['i_green', 'B', 'r', 'i', 'd', 'g', 'e'];

const imagePositions = [
  { xStart: -160, xEnd: -120, yStart: 50, yEnd: 150 },
  { xStart: -80, xEnd: -40, yStart: 20, yEnd: 100 },
  { xStart: 0, xEnd: 40, yStart: 30, yEnd: 120 },
  { xStart: 80, xEnd: 120, yStart: 40, yEnd: 90 },
  { xStart: 160, xEnd: 200, yStart: 10, yEnd: 160 },
  { xStart: 240, xEnd: 280, yStart: 30, yEnd: 130 },
  { xStart: 320, xEnd: 360, yStart: 20, yEnd: 180 },
];

export default function StartPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const containerRef = useRef(null);
  const { scrollY } = useScroll();

   const [transforms, setTransforms] = useState<{ x: number; y: number }[]>([]);

  const x0 = useTransform(scrollY, [0, 1000], [imagePositions[0].xStart, imagePositions[0].xEnd]);
  const x1 = useTransform(scrollY, [0, 1000], [imagePositions[1].xStart, imagePositions[1].xEnd]);
  const x2 = useTransform(scrollY, [0, 1000], [imagePositions[2].xStart, imagePositions[2].xEnd]);
  const x3 = useTransform(scrollY, [0, 1000], [imagePositions[3].xStart, imagePositions[3].xEnd]);
  const x4 = useTransform(scrollY, [0, 1000], [imagePositions[4].xStart, imagePositions[4].xEnd]);
  const x5 = useTransform(scrollY, [0, 1000], [imagePositions[5].xStart, imagePositions[5].xEnd]);
  const x6 = useTransform(scrollY, [0, 1000], [imagePositions[6].xStart, imagePositions[6].xEnd]);

  const y0 = useTransform(scrollY, [0, 1000], [imagePositions[0].yStart, imagePositions[0].yEnd]);
  const y1 = useTransform(scrollY, [0, 1000], [imagePositions[1].yStart, imagePositions[1].yEnd]);
  const y2 = useTransform(scrollY, [0, 1000], [imagePositions[2].yStart, imagePositions[2].yEnd]);
  const y3 = useTransform(scrollY, [0, 1000], [imagePositions[3].yStart, imagePositions[3].yEnd]);
  const y4 = useTransform(scrollY, [0, 1000], [imagePositions[4].yStart, imagePositions[4].yEnd]);
  const y5 = useTransform(scrollY, [0, 1000], [imagePositions[5].yStart, imagePositions[5].yEnd]);
  const y6 = useTransform(scrollY, [0, 1000], [imagePositions[6].yStart, imagePositions[6].yEnd]);

  const xTransforms = [x0, x1, x2, x3, x4, x5, x6];
  const yTransforms = [y0, y1, y2, y3, y4, y5, y6];

 useEffect(() => {
    const calculateTransforms = () => {
      const calculatedTransforms = imagePositions.map(({ xStart, xEnd, yStart, yEnd }) => {
        // 스크롤 값에 따라 위치 변환
        const x = (scrollY.get() / 1000) * (xEnd - xStart) + xStart; // x 이동
        const y = (scrollY.get() / 1000) * (yEnd - yStart) + yStart; // y 이동
        return { x, y };
      });
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
      className="min-h-screen flex flex-col relative overflow-hidden"
    >
      {/* 상단 이미지 애니메이션 패널 */}
<div className="top-1/4 left-2/3 transform -translate-x-1/3 -translate-y-1/2 relative ">
        {imageNames.map((name, idx) => {
          const x = xTransforms[idx];
          const y = yTransforms[idx];

          return (
            <motion.img
              key={idx}
              src={`/images/${name}.png`}
              alt={`img-${idx}`}
              style={{
                x, // .get()을 사용하여 MotionValue에서 값을 추출
                y,
              }}
              initial={{ x: imagePositions[idx].xStart, y: imagePositions[idx].yStart }}
              animate={{ x: imagePositions[idx].xEnd, y: imagePositions[idx].yEnd }} // .get()을 사용하여 값을 전달
              transition={{ type: 'spring', stiffness: 50 }}
              className="absolute w-[60px] h-[60px] z-10 object-contain"
            />
          );
        })}
      </div>
      
      <main className="flex-grow">
        {/* Hero Section */}
       <section className="bg-i-ivory py-24 px-6">
  <div className="max-w-7xl mx-auto flex justify-between items-center mt-24">
    <div className="flex-1">
      <h2 className="text-2xl text-i-darkblue font-bold mb-4">
        Welcome to
      </h2>
      <p className="text-xl text-i-darkblue mb-4">
        감정은 행동이 아닌, 말로 표현될 수 있어야 합니다.
      </p>
      <p className="text-lg text-i-darkblue mb-8">
        iBridge는 부모가 아이의 진짜 마음을 이해할 수 있도록 돕는, 감정
        분석 기반의 소통 플랫폼입니다.
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
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
      className="w-80"
    >
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 relative overflow-visible min-h-[200px]">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-i-lightorange to-i-orange"></div>
        <div className="space-y-3">
          <LoginButton />
        </div>
      </div>
    </motion.div>
  </div>
</section>
        
        {/* Intro Text Section */}
        <section className="max-w-5xl mx-auto px-16 mt-12 mb-32 relative text-center">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold text-gray-900 mb-8"
          >
            부모와 자녀, 감정의 다리를 잇다 — iBridge
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-lg text-gray-900 leading-relaxed mb-8"
          >
            아이의 행동 이면에는 언제나 &quot;나를 이해해 줘!&quot;라는 외침이
            있습니다. 하지만 부모도 완벽할 수 없기에, 올바른 소통을 위한 도구가
            필요합니다. iBridge는 부모가 감정을 개입하지 않고 자녀의 속마음을
            이해할 수 있도록 도와주는 웹 플랫폼입니다.
          </motion.p>
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
        <div className="w-full mx-auto px-8 mb-16">
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
      </main>
    </div>
  );
}
