'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { unlockAudio } from '@/lib/audio';

type Props = {
  childId: string;
  specifiedDone: boolean;
};

export default function GreetingSection({ childId, specifiedDone }: Props) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const ButtonContent = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center w-full h-full md:w-[160px] md:h-[68px]">
      <p className="w-full text-lg sm:text-xl md:text-2xl font-extrabold leading-[140%] text-left">
        {children}
      </p>
    </div>
  );

  const go = async (path: string) => {
    if (isNavigating) return;
    setIsNavigating(true);
    try {
      // ✅ 사용자 제스처 안에서 호출되도록 onClick → go 로직
      await unlockAudio(); // 오디오 언락
      router.push(path); // 클라이언트 사이드 내비게이션
    } finally {
      // push 후에는 보통 이 컴포넌트가 교체되므로 굳이 false로 되돌릴 필요는 없음
    }
  };

  return (
    <div className="relative rounded-[40px] shadow-md overflow-hidden">
      <Image
        src="/images/child-bg.webp"
        alt="교실 배경"
        fill
        priority
        sizes="100vw"
        className="z-0 object-cover object-top"
      />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-x-5 p-6 md:px-12 md:py-0">
        <div className="w-[300px] h-[250px] md:w-[500px] md:h-[400px] relative flex-shrink-0 order-last md:order-first">
          <div
            className="absolute w-[417.44px] h-[410.58px] top-[45.22px] left-[26.74px] rotate-[4.22deg] scale-[0.6] md:scale-100 origin-top-left"
            style={{ filter: 'drop-shadow(-30px 10px 0px rgba(0,0,0,0.2))' }}
          >
            <Image
              src="/images/owlly.webp"
              alt="올리 캐릭터"
              fill
              style={{ objectFit: 'contain' }}
              sizes="(max-width: 768px) 250px, 418px"
              quality={100}
              priority
            />
          </div>
        </div>

        <div className="w-full md:w-auto flex-1 flex flex-col items-start justify-center py-4 md:py-[60px] gap-6">
          <h2 className="text-3xl md:text-[40px] font-extrabold leading-[150%] text-gray-800 text-left">
            안녕, 오늘은
            <br />
            어떤 이야기를 해볼까?
          </h2>

          {/* 버튼 그룹 */}
          <div className="w-full max-w-md md:max-w-none flex flex-col sm:flex-row gap-3 md:gap-5">
            {specifiedDone ? (
              <div className="flex-1 md:flex-none md:w-[240px] md:h-[124px] rounded-[40px] bg-gray-10 flex items-center justify-center p-5 md:py-7 md:px-10 text-gray-30 cursor-not-allowed">
                <ButtonContent>
                  오늘의 질문
                  <br />
                  답변 완료
                </ButtonContent>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => go(`/child/${childId}/question`)}
                disabled={isNavigating}
                className="flex-1 md:flex-none md:w-[240px] md:h-[124px] rounded-[40px] bg-primary flex items-center justify-center p-5 md:py-7 md:px-10 text-white hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-wait"
                aria-label="오늘의 질문에 대답하러 가기"
              >
                <ButtonContent>
                  오늘의 질문에
                  <br />
                  대답할게!
                </ButtonContent>
              </button>
            )}

            <button
              type="button"
              onClick={() => go(`/child/${childId}/free`)}
              disabled={isNavigating}
              className="flex-1 md:flex-none md:w-[240px] md:h-[124px] rounded-[40px] bg-gray-90 flex items-center justify-center p-5 md:py-7 md:px-10 text-white hover:bg-gray-80 transition-colors disabled:opacity-60 disabled:cursor-wait"
              aria-label="하고 싶은 말 하러 가기"
            >
              <ButtonContent>
                하고싶은
                <br />
                말이 있어!
              </ButtonContent>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
