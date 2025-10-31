'use client';

import { useRouter } from 'next/navigation';
import LogoutButton from '@/components/Auth/LogoutButton';
import { Text } from '@/ui/Text';
import { Button } from '@/ui/Button';
import { OwlIcon } from '@/ui/icon/OwlIcon';
import { Logo } from '@/ui/icon/Logo';

interface HeaderProps {
  /** 관리자 페이지 버튼 노출 여부 */
  showAdmin?: boolean;
  /** 관리자 페이지로 이동하는 핸들러 함수 */
  onAdminClick?: () => void;
}

/**
 * 앱 전역 헤더 컴포넌트
 * @param showAdmin - 관리자 페이지 버튼 노출 여부
 * @param onAdminClick - 관리자 페이지 버튼 클릭 핸들러
 */
export default function Header({
  showAdmin = false,
  onAdminClick,
}: HeaderProps) {
  const router = useRouter();
  
  // 로고 클릭 시 메인 화면(/profile)으로 이동하는 핸들러
  const handleLogoClick = () => {
    router.push('/profile');
  };
  
  return (
    <header className="fixed top-0 left-0 w-full h-16 px-6 sm:px-10 bg-white flex items-center overflow-hidden whitespace-nowrap z-50 shadow-md">
      <div className="flex justify-between items-center w-full max-w-7xl mx-auto"> 
        {/* 좌측: 로고 그룹 (클릭 가능하도록 수정) */}
        <button 
          onClick={handleLogoClick} 
          className="flex justify-start items-center gap-2 cursor-pointer focus:outline-none"
          aria-label="홈으로 이동"
        >
          <OwlIcon className="w-6 h-6" />
          <Logo className="w-auto h-[28px]" />
        </button>

        {/* 우측: 버튼 그룹 (관리자 페이지, 로그아웃) */}
        <div className="flex items-center gap-2">
          {/* 1. 관리자 페이지 버튼 */}
          {showAdmin && (
            <Button
              onClick={onAdminClick}
              className="h-10 px-4 py-2.5 bg-gray-100 "
            >
              <Text variant="caption04" className="text-grayscale-gray70">
                관리자 페이지
              </Text>
            </Button>
          )}

          {/* 2. 로그아웃 버튼 */}
          <LogoutButton className="h-10 px-4 py-2.5 bg-grayscale-gray5">
            <Text variant="caption04" className="text-grayscale-gray70">
              로그아웃
            </Text>
          </LogoutButton>
        </div>
      </div>
    </header>
  );
}
