'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Text } from '@/ui/Text';
import { Button } from '@/ui/Button';

type Props = {
  childId: string;
  specifiedDone: boolean;
};

export default function GreetingSection({ childId, specifiedDone }: Props) {
  return (
    // [수정 2] 모바일 최소 너비를 360px로 고정합니다.
    <div>
    <div className="min-w-[360px] relative rounded-[40px] shadow-md overflow-hidden px-15">
      <Image
        src="/images/child-bg.webp"
        alt="교실 배경"
        fill
        priority
        sizes="100vw"
        className="z-0 object-cover object-top"
      />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-x-5 p-6 md:px-12 md:py-0">
        
        {/* [수정 1]
          - md:order-first -> lg:order-first로 변경
          - 이렇게 하면 lg:flex-row가 되는 시점과 순서가 바뀌는 시점이 일치하게 됩니다.
        */}
        <div className="w-[300px] h-[250px] md:w-[450px] md:h-[400px] relative flex-shrink-0 order-last lg:order-first">
          {/*올리 캐릭터 */}
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
        
        {/*제목 및 질문 버튼 */}
        <div className="w-full flex flex-col items-start justify-center py-14 gap-7 md:flex-1">
          <Text
            variant={'title01'}
            className=" text-grayscale-gray90 text-left "
          >
            안녕, 오늘은
            <br />
            어떤 이야기를 해볼까?
          </Text>

          {/* [참고]
            이전 대화에서 적용했던 버튼 줄바꿈(flex-wrap)은
            현재 코드에 다시 적용하지 않았습니다.
          */}
          <div className="w-full self-stretch flex justify-start items-center gap-5 ">
            {specifiedDone ? (
              <Button
                variant={'primary'}
                className="w-full h-auto self-stretch px-10 py-7 rounded-[40px] justify-start text-left whitespace-nowrap"
              >
                오늘의 질문
                <br />
                답변 완료
              </Button>
            ) : (
              <Button
                as={Link}
                href={`/child/${childId}/question`}
                variant={'primary'}
                className="w-full self-stretch px-10 py-7 rounded-[40px] justify-start text-left whitespace-nowrap"
              >
                오늘의 질문에
                <br />
                대답할게!
              </Button>
            )}

            <Button
              as={Link}
              href={`/child/${childId}/free`}
              variant={'primary'}
              className="w-full bg-grayscale-gray80 px-10 py-7 rounded-[40px] justify-start text-left whitespace-nowrap"
            >
              하고싶은
              <br />
              말이 있어!
            </Button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}