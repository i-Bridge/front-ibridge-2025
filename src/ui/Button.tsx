import { ElementType, ReactNode } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';
import { Text, textVariants } from '@/ui/Text';

// Text 컴포넌트의 variant 타입을 정확하게 추출합니다.
type TextVariantType = VariantProps<typeof textVariants>['variant'];

// 1. cva 정의
const buttonVariants = cva(
  // ---  기본 스타일  ---
  [
    'inline-flex w-full items-center justify-center text-center', // self-stretch, justify-center
    'h-16 px-10 py-5', // h-16, px-10, py-5
    'rounded-[999px]', // rounded-[999px]
    'transition-colors', // 부드러운 호버 효과
    'disabled:opacity-50 ', // 비활성화 스타일
   'disabled:hover:after:opacity-0',
    'relative', // 1. pseudo-element 포지셔닝의 기준점
    'overflow-hidden', // 2. pseudo-element가 rounded 코너 밖으로 나가지 않도록 함
    'isolate', // 3. (선택) 새로운 스태킹 컨텍스트를 만들어 z-index 문제를 방지
    // 4. ::after pseudo-element를 오버레이로 사용
    "after:content-['']", // 가상 요소 필수 속성
    'after:absolute',
    'after:inset-0', // 부모(버튼) 크기에 꽉 차게
    'after:bg-black/5', // black 10%
    'after:opacity-0', // 평소에는 투명
    'after:transition-opacity', // 부드러운 효과를 위해 transition 추가

    // 5. 버튼에 hover시 ::after(오버레이)를 보이게 함
    'hover:after:opacity-100',
  ],
  {
    variants: {
      // --- 종류(Variant) ---
      variant: {
        primary: 'bg-primary-primary text-primary-primary ',
        grayscale: 'bg-grayscale-gray10 text-grayscale-gray70 ',
        secondary: 'bg-secondary-secondary text-secondary-secondary ',
      },
    },
    // --- 기본값 ---
    defaultVariants: {
      variant: 'primary',
    },
  },
);

// 2. 컴포넌트 Props 타입 정의 (이전과 동일)
type ButtonProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;

  textVariant?: TextVariantType;
  textColor?: string;
} & VariantProps<typeof buttonVariants> &
  Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>;
/**
 * 디자인 시스템의 버튼 컴포넌트입니다.
 * 내부적으로 'Text' 컴포넌트의 'caption02' 스타일, 'h-16 px-10 py-5' 스타일을 기본으로 사용하며,
 * 'textVariant' prop을 통해 다른 타이포그래피 스타일을 적용할 수 있습니다.
 *
 * @example
 * // 1. 기본 사용 (Text: caption02)
 * <Button onClick={() => ...}>로그아웃</Button>
 *
 * // 2. Text variant와 색상 지정
 * <Button variant="grayscale" textVariant="body01" textColor="text-error-error">
 * 큰 글씨 에러 버튼
 * </Button>
 *
 * // 3. Next.js 내부 링크로 사용
 * <Button as={Link} href="/profile" variant="grayscale">
 * 내 프로필
 * </Button>
 */
export function Button<T extends ElementType = 'button'>({
  as,
  variant,
  className,
  children,
  textVariant = 'caption02' as TextVariantType, 
  textColor,
  ...props
}: ButtonProps<T>) {
  const Component = as || 'button';

   let defaultTextColorClass = '';
  switch (variant) {
    case 'primary':
      defaultTextColorClass = 'text-white';
      break;
    case 'grayscale':
      defaultTextColorClass = 'text-grayscale-gray70'; 
      break;
    case 'secondary':
    default:
      defaultTextColorClass = 'text-grayscale-gray90'; 
      break;
  }
const textClass = twMerge(defaultTextColorClass, textColor);
  return (
    <Component
      className={twMerge(buttonVariants({ variant }), className)}
      {...props}
    >
      {/* 3. 타이포그래피는 Text 컴포넌트에 위임*/}
      <Text 
        as="span" 
        variant={textVariant} // Button의 textVariant prop 사용
        className={textClass} // 색상 클래스 적용
      > 
        {children}
      </Text>
    </Component>
  );
}
