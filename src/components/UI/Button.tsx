import { ElementType, ReactNode } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';
import { Text } from '@/components/UI/Text';

// 1. cva 정의 
const buttonVariants = cva(
  // ---  기본 스타일  ---
  [
    'inline-flex w-full items-center justify-center text-center', // self-stretch, justify-center
    'h-16 px-10 py-5', // h-16, px-10, py-5
    'rounded-[999px]', // rounded-[999px]
    'transition-colors', // 부드러운 호버 효과
    'disabled:opacity-50 disabled:cursor-not-allowed', // 비활성화 스타일
  ],
  {
    variants: {
      // --- 종류(Variant) ---
      variant: {
        // 1. Primary 버튼 
        primary:
          'bg-primary-primary text-primary-primary hover:bg-primary-primaryLight',
        
        // 2. Grayscale 버튼 
        grayscale:
          'bg-grayscale-gray10 text-grayscale-gray70 hover:bg-grayscale-gray20', // (hover 색상은 임의로 20으로 지정)
      },
    },
    // --- 기본값 ---
    defaultVariants: {
      variant: 'primary',
    },
  }
);

// 2. 컴포넌트 Props 타입 정의 (이전과 동일)
type ButtonProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
} & VariantProps<typeof buttonVariants> &
  Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>;

/**
 * 디자인 시스템의 버튼 컴포넌트입니다.
 * 내부적으로 'Text' 컴포넌트의 'caption02' 스타일을 사용합니다.
 *
 * @example
 * // 1. 기본 버튼 (primary variant)
 * <Button onClick={() => ...}>로그아웃</Button>
 *
 * // 2. grayscale variant
 * <Button variant="grayscale">수정하기</Button>
 *
 * // 3. Next.js 내부 링크로 사용 (새로고침 없음)
 * // import Link from 'next/link';
 * <Button as={Link} href="/profile" variant="grayscale">
 * 내 프로필
 * </Button>
 */
export function Button<T extends ElementType = 'button'>({
  as,
  variant,
  className,
  children,
  ...props
}: ButtonProps<T>) {
  const Component = as || 'button';

  return (
    <Component
      className={twMerge(buttonVariants({ variant }), className)}
      {...props}
    >
      {/* 3. 타이포그래피는 Text 컴포넌트에 위임 (caption02) */}
      <Text as="span" variant="caption02">
        {children}
      </Text>
    </Component>
  );
}