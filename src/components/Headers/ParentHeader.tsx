'use client';

import { useRouter } from 'next/navigation';
import LogoutButton from '@/components/Headers/LogoutButton';
import { Text } from '@/ui/Text';
import { Button } from '@/ui/Button';
import { OwlIcon } from '@/ui/icon/OwlIcon';
import { Logo } from '@/ui/icon/Logo';

interface HeaderProps {
  /** 관리자 페이지로 이동할 때 사용할 firstchild ID. ID가 0 또는 null/undefined일 경우 버튼을 숨기거나 비활성화할 수 있습니다. */
  firstchildId: number | undefined;
}

/**
 * 앱 전역 헤더 컴포넌트
 * @param firstchildId - 관리자 페이지로 이동할 부모 ID
 */
export default function ParentHeader({ firstchildId }: HeaderProps) {
  const router = useRouter();

  // 관리자 페이지 버튼 노출 여부 (firstchildId가 유효할 때만 노출)
  const showAdminButton = firstchildId !== undefined && firstchildId > 0;

  // 관리자 페이지로 이동하는 핸들러 (동적 경로 사용)
  const handleAdminClick = () => {
    if (firstchildId) {
      // 동적 경로: /parent/[id]/dashboard 로 이동
      const path = `/parent/${firstchildId}/dashboard`;
      router.push(path);
    } else {
      console.error('관리자 ID가 유효하지 않아 이동할 수 없습니다.');
    }
  };

  return (
    <header className="bg-white flex fixed items-center justify-center top-0 left-0 w-full h-16 px-10 overflow-hidden whitespace-nowrap z-50 ">
      <div className="flex justify-between items-center w-full max-w-7xl mx-auto">
        {/* 좌측: 로고 그룹 (클릭 가능하도록 수정) */}
        <div className="flex justify-center items-start gap-2 cursor-pointer focus:outline-none">
          <OwlIcon className="w-6 h-6" />
          <Logo className="w-[73px] h-[28px]" />
        </div>

        {/* 우측: 버튼 그룹 (관리자 페이지, 로그아웃) */}
        <div className="flex items-center gap-2">
          {/* 1. 관리자 페이지 버튼 */}
          {showAdminButton && (
            <Button
              onClick={handleAdminClick} // 💡 수정된 핸들러 연결
              className="h-10 px-4 py-2.5 bg-gray-50 "
            >
              <Text variant="caption04" className="text-gray-700">
                관리자 페이지
              </Text>
            </Button>
          )}

          {/* 2. 로그아웃 버튼 */}
          <LogoutButton
            className="h-10 px-4 py-2.5 bg-gray-50"
            textVariant="caption04" // [!!] textVariant prop을 직접 사용
          >
            로그아웃 {/* [!!] children으로는 순수 텍스트만 전달 */}
          </LogoutButton>
        </div>
      </div>
    </header>
  );
}
