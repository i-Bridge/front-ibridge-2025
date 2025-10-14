'use client';

import Image from 'next/image';
import Link from 'next/link';

type Props = {
  childId: string;
  specifiedDone: boolean;
};

export default function GreetingSection({ childId, specifiedDone }: Props) {
  const ButtonContent = ({ text }: { text: string }) => (
    <div className="w-[160px] h-[68px] flex items-center">
      <p className="text-2xl font-extrabold leading-[140%] text-left">{text}</p>
    </div>
  );

  return (
    <div className="relative rounded-[40px] shadow-lg overflow-hidden h-[400px]">
      {/* 배경 레이어 (z-0) */}
      <Image
        src="/images/child-bg.webp"
        alt="교실 배경"
        fill
        priority
        sizes="100vw"
        className="z-0 object-cover object-top"
      />

      {/* 콘텐츠 레이어 (z-10) */}
      <div className="relative z-10 h-full flex items-center justify-center gap-x-5 px-12">
        {/* 왼쪽 캐릭터 영역 */}
        {/* ✅ [수정] 부모 div가 500x400 크기를 갖고, 자식 div가 그 안에서 절대 위치를 잡도록 구조를 변경했습니다. */}
        <div className="w-[500px] h-[400px] relative flex-shrink-0">
          {/* 이 div가 실제 이미지의 크기, 위치, 회전, 그림자를 담당합니다. */}
          <div
            className="absolute w-[417.44px] h-[410.58px] top-[45.22px] left-[26.74px] rotate-[4.22deg]"
            style={{
              filter: 'drop-shadow(-30px 10px 0px rgba(0,0,0,0.2))',
            }}
          >
            <Image
              src="/images/talking-owlly.webp"
              alt="올리 캐릭터"
              fill
              style={{ objectFit: 'contain' }}
              sizes="418px"
            />
          </div>
        </div>

        {/* 오른쪽 콘텐츠 영역 */}
        <div className="w-[500px] flex flex-col gap-7">
          <h2 className="text-[40px] font-extrabold leading-[150%] text-gray-800">
            안녕, 오늘은
            <br />
            어떤 이야기를 해볼까?
          </h2>

          {/* 버튼 그룹 */}
          <div className="w-full flex gap-5">
            {specifiedDone ? (
              <div className="w-[240px] h-[124px] rounded-[40px] bg-gray-10 flex items-center justify-center p-7 text-gray-30 cursor-not-allowed">
                <ButtonContent text="오늘의 질문 답변 완료" />
              </div>
            ) : (
              <Link
                href={`/child/${childId}/talk/question`}
                className="w-[240px] h-[124px] rounded-[40px] bg-primary flex items-center justify-center p-7 text-white hover:bg-primary/90 transition-colors"
              >
                <ButtonContent text="오늘의 질문에 대답할래!" />
              </Link>
            )}
            <Link
              href={`/child/${childId}/talk/free`}
              className="w-[240px] h-[124px] rounded-[40px] bg-gray-90 flex items-center justify-center p-7 text-white hover:bg-gray-80 transition-colors"
            >
              <ButtonContent text="하고싶은 말이 있어!" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
