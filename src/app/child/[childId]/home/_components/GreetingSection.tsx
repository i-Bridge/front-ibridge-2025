'use client';

import Image from 'next/image';
import Link from 'next/link';

type Props = {
  childId: string;
  specifiedDone: boolean;
};

export default function GreetingSection({ childId, specifiedDone }: Props) {
  const ButtonContent = ({ text }: { text: string }) => (
    // ✅ [수정] 데스크탑(md) 크기 이상에서는 버튼 내부 콘텐츠의 크기를 Figma 스펙에 맞게 고정합니다.
    <div className="flex items-center w-full h-full md:w-[160px] md:h-[68px]">
      <p className="w-full text-lg sm:text-xl md:text-2xl font-extrabold leading-[140%] text-left">
        {text}
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
              src="/images/talking-owlly.webp"
              alt="올리 캐릭터"
              fill
              style={{ objectFit: 'contain' }}
              sizes="(max-width: 768px) 250px, 418px"
              quality={100}
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
              // ✅ [수정] 데스크탑(md) 크기 이상에서 고정 너비, 높이, 패딩을 적용합니다.
              <div className="flex-1 md:flex-none md:w-[240px] md:h-[124px] rounded-[40px] bg-gray-10 flex items-center justify-center p-5 md:py-7 md:px-10 text-gray-30 cursor-not-allowed">
                <ButtonContent text="오늘의 질문 답변 완료" />
              </div>
            ) : (
              // ✅ [수정] 데스크탑(md) 크기 이상에서 고정 너비, 높이, 패딩을 적용합니다.
              <Link
                href={`/child/${childId}/talk/question`}
                className="flex-1 md:flex-none md:w-[240px] md:h-[124px] rounded-[40px] bg-primary flex items-center justify-center p-5 md:py-7 md:px-10 text-white hover:bg-primary/90 transition-colors"
              >
                <ButtonContent text="오늘의 질문에 대답할게!" />
              </Link>
            )}
            {/* ✅ [수정] 데스크탑(md) 크기 이상에서 고정 너비, 높이, 패딩을 적용합니다. */}
            <Link
              href={`/child/${childId}/talk/free`}
              className="flex-1 md:flex-none md:w-[240px] md:h-[124px] rounded-[40px] bg-gray-90 flex items-center justify-center p-5 md:py-7 md:px-10 text-white hover:bg-gray-80 transition-colors"
            >
              <ButtonContent text="하고싶은 말이 있어!" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
