'use client';

import Image from 'next/image';
import Link from 'next/link';

type Props = {
  childId: string;
  specifiedDone: boolean;
};

export default function GreetingSection({ childId, specifiedDone }: Props) {
  const ButtonContent = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center w-full h-full md:w-[160px] md:h-[68px]">
      <p className="w-full text-lg sm:text-xl md:text-2xl font-extrabold leading-[140%] text-left">
        {children}
      </p>
    </div>
  );

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
            style={{
              filter: 'drop-shadow(-30px 10px 0px rgba(0,0,0,0.2))',
            }}
          >
            <Image
              src="/images/owlly.webp"
              alt="올리 캐릭터"
              width={1000}
              height={1000}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
              sizes="(max-width: 768px) 250px, 418px"
              quality={100}
            />
          </div>
        </div>

        <div className="w-full md:w-auto flex-1 flex flex-col items-start justify-center py-4 md:py-[60px] gap-6 md:pl-8">
          <h2 className="text-3xl md:text-[40px] font-extrabold leading-[150%] text-gray-800 text-left">
            안녕, 오늘은
            <br />
            어떤 이야기를 해볼까?
          </h2>

          <div className="w-full max-w-md md:max-w-none flex flex-col sm:flex-row gap-3 md:gap-5">
            {specifiedDone ? (
              // ✅ [수정] 'flex-1'을 제거하여 버튼이 불필요하게 늘어나는 것을 방지합니다.
              <div className="md:flex-none md:w-[240px] md:h-[124px] rounded-[40px] bg-gray-10 flex items-center justify-center p-5 md:py-7 md:px-10 text-gray-30 cursor-not-allowed">
                <ButtonContent>
                  오늘의 질문
                  <br />
                  답변 완료
                </ButtonContent>
              </div>
            ) : (
              // ✅ [수정] 'flex-1'을 제거합니다.
              <Link
                href={`/child/${childId}/question`}
                className="md:flex-none md:w-[240px] md:h-[124px] rounded-[40px] bg-primary flex items-center justify-center p-5 md:py-7 md:px-10 text-white hover:bg-primary/90 transition-colors"

              >
                <ButtonContent>
                  오늘의 질문에
                  <br />
                  대답할게!
                </ButtonContent>
              </Link>
            )}
            {/* ✅ [수정] 'flex-1'을 제거합니다. */}
            <Link
              href={`/child/${childId}/free`}
              className="md:flex-none md:w-[240px] md:h-[124px] rounded-[40px] bg-gray-90 flex items-center justify-center p-5 md:py-7 md:px-10 text-white hover:bg-gray-80 transition-colors"
            >
              <ButtonContent>
                하고싶은
                <br />
                말이 있어!
              </ButtonContent>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
