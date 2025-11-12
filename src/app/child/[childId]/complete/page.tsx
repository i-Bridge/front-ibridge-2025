'use client';
import { useRouter, useParams } from 'next/navigation';
import { useEffect } from 'react';
import AvatarIcon from '../../../../ui/icon/AvatarIcons';
import FullscreenToggle from '../_components/header/FullscreenToggle';
import { Text } from '@/ui/Text';
import { Button } from '@/ui/Button';
import { showCustom } from '@/lib/toast';
import { GrapeIcon } from '@/ui/icon/icon';
/**
 * 홈 아이콘 SVG 컴포넌트 (컴포넌트 외부에 정의하여 재사용성을 높였습니다)
 */
function HomeIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 9.75L12 3L21 9.75V21H15V15H9V21H3V9.75Z"
        fill="white"
        stroke="white"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ConversationCompletePage() {
  const router = useRouter();
  const params = useParams();
  const childId = params.childId as string;

  // ✅ [수정] 컴포넌트가 마운트될 때 (페이지 로드시) 딱 한 번만 토스트를 실행합니다.
  useEffect(() => {
    showCustom({
      icon: <GrapeIcon />,
      message: '포도알 1개를 받았어요!',
    });
    // 빈 의존성 배열은 마운트 시 한 번만 실행됨을 보장합니다.
  }, []);

  const handleGoHome = () => {
    if (childId) {
      router.push(`/child/${childId}/home`);
    } else {
      router.push('/'); // 비상시 홈으로
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full min-h-screen bg-primary-primaryLight p-6">
      {/* ============================================== */}
      {/* ✅ [추가] 헤더 */}
      {/* ============================================== */}
      <header className="absolute top-6 left-6 z-10">
        <FullscreenToggle />
      </header>
      <div className="flex flex-col items-center text-center">
        {/* 2. 캐릭터 이미지 */}
        <AvatarIcon className="w-60 h-60" />
        {/* 3. 완료 텍스트 */}
        <Text variant={'title01'} className="text-primary-primary mt-10">
          오늘의 질문
          <br />
          답변 완료!
        </Text>

        {/* 4. 홈으로 이동하기 버튼 */}
        <Button
          onClick={handleGoHome}
          variant="primary"
          textVariant="caption02"
          textClass="!inline-flex !flex-row items-center gap-2 whitespace-nowrap"
          className="mt-10"
        >
          <HomeIcon />
          홈으로 이동하기
        </Button>
      </div>
    </div>
  );
}
