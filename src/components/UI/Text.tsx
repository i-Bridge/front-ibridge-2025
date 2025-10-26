import { ElementType, ReactNode } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge'; 

// 1. cva로 스타일 변형(variants) 정의 
const textVariants = cva(
  'font-normal', // 기본 스타일 (body04 기준)
  {
    variants: {
      variant: {
        // Titles
        title01:
          'text-[2.5rem] font-extrabold leading-[3.75rem] tracking-[-0.025rem]',
        title02:
          'text-[1.75rem] font-extrabold leading-[2.45rem] tracking-[0rem]',
        title03:
          'text-[1.5rem] font-extrabold leading-[2.1rem] tracking-[0rem]',
        title04:
          'text-[1.25rem] font-extrabold leading-[1.75rem] tracking-[0rem]',

        // Bodies
        body01: 'text-[1.75rem] font-extrabold leading-[2.625rem] tracking-[0rem]',
        body02: 'text-[1.25rem] font-bold leading-[2rem] tracking-[0rem]',
        body03: 'text-[1.125rem] font-bold leading-[1.8rem] tracking-[0rem]',
        body04: 'text-[1rem] font-normal leading-[1.6rem] tracking-[0rem]',
        body05: 'text-[0.875rem] font-normal leading-[1.4rem] tracking-[0rem]',

        // Captions
        caption01:
          'text-[1.5rem] font-extrabold leading-[2.1rem] tracking-[0rem]',
        caption02:
          'text-[1.25rem] font-extrabold leading-[1.875rem] tracking-[0rem]',
        caption03:
          'text-[1.0rem] font-extrabold leading-[1.5rem] tracking-[0rem]', 
        caption04:
          'text-[0.875rem] font-extrabold leading-[1.3125rem] tracking-[0rem]',
      },
    },
    defaultVariants: {
      variant: 'body04',
    },
  }
);

// 2. 컴포넌트 Props 타입 정의 
// (1)as, children, className + (2)cva의 variant + (3)선택된 태그의 HTML 기본 속성을 모두 합친 타입
type TextProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
} & VariantProps<typeof textVariants> &
  Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>;

/**
 * 디자인 시스템의 타이포그래피를 적용하는 다형성 컴포넌트입니다.
 *
 * @example
 * // 1. 기본 사용 (variant 지정)
 * <Text variant="title01">메인 타이틀</Text>
 *
 * // 2. 'as' prop으로 HTML 태그 변경 (시맨틱 마크업)
 * <Text as="h1" variant="title01">H1 태그</Text>
 *
 * // 3. className 덮어쓰기
 * <Text variant="body02" className="text-red-500">빨간색 텍스트</Text>
 *
 * // 4. 기본값 사용 ('p' 태그, 'body04' 스타일)
 * <Text>기본 본문 스타일 (body04)</Text>
 *
 * // 5. 다형성 활용 (Next.js 내부 링크)
 * // import Link from 'next/link';
 * <Text as={Link} variant="body05" href="/my-page">
 * 내부 페이지로 이동 (Link)
 * </Text>
 *
 * // 6. 다형성 활용 (외부 링크)
 * <Text as="a" variant="body05" href="https://google.com" target="_blank">
 * 외부 사이트로 이동 (a 태그)
 * </Text>
 *
 * // 7. 다형성 활용 (<button> 태그의 'onClick' 속성 전달)
 * <Text as="button" variant="body02" onClick={() => alert('클릭!')}>
 * 클릭 가능한 버튼
 * </Text>
 */

// 3. 컴포넌트 구현 
export function Text<T extends ElementType = 'p'>({
  as,
  variant,
  className,
  children,
  ...props
}: TextProps<T>) {
  const Component = as || 'p'; // 기본 태그는 'p'로 설정

  return (
    <Component
      
      className={twMerge(textVariants({ variant }), className)}
      {...props}
    >
      {children}
    </Component>
  );
}


