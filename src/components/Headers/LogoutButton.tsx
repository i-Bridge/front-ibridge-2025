'use client';

import { signOut } from 'next-auth/react';
import { ReactNode } from 'react';
import { Button } from '@/ui/Button';

// [!!] 1. Button.tsx와 동일한 타입을 가져오기 위해 임포트
import { VariantProps } from 'class-variance-authority';
import { textVariants } from '@/ui/Text'; // Button.tsx가 의존하는 Text.tsx의 textVariants

// [!!] 2. Button.tsx와 동일한 TextVariantType 정의
type TextVariantType = VariantProps<typeof textVariants>['variant'];

export const handleLogout = async () => {
  sessionStorage.clear();
  localStorage.clear();
  await signOut({ callbackUrl: '/' });
};

interface LogoutButtonProps {
  children: ReactNode;
  className?: string;
  // [!!] 3. 타입을 string에서 TextVariantType으로 수정
  textVariant?: TextVariantType;
}

export default function LogoutButton({
  children,
  className, // 기본값 ('') 제거
  textVariant, // [!!] 4. 기본값 (='') 제거. (undefined로 전달되어야 Button의 기본값이 적용됨)
}: LogoutButtonProps) {
  return (
    <Button
      variant="grayscale"
      onClick={handleLogout}
      className={className}
      textVariant={textVariant} // [!!] 이제 타입이 일치합니다.
      
    >
      {children}
    </Button>
  );
}