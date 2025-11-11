import { ElementType, ReactNode } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge'; 

// 1. cva로 스타일 변형(variants) 정의 
export const textVariants = cva(
  ['font-nps', 'text-grayscale-gray90'],
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
        body01: 'text-[1.75rem] font-normal leading-[2.625rem] tracking-[0rem]',
        body02: 'text-[1.25rem] font-normal leading-[2rem] tracking-[0rem]',
        body03: 'text-[1.125rem] font-normal leading-[1.8rem] tracking-[0rem]',
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
// (1) cva의 variant 타입을 추출합니다 (예: "title01" | "body04" | ...)
type TextVariant = VariantProps<typeof textVariants>['variant'];

// (2) variant prop에 반응형 객체를 허용하는 타입을 만듭니다.
type ResponsiveVariant = {
  initial: TextVariant; // 'initial'은 Tailwind의 기본(모바일)에 해당합니다.
  md?: TextVariant;    // tailwind.config.ts의 'md' (768px)
  lg?: TextVariant;    // tailwind.config.ts의 'lg' (1280px)
};

// (3) TextProps가 'variant: 문자열' 또는 'variant: 반응형 객체'를 모두 받도록 수정합니다.
export type TextProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
  variant?: TextVariant | ResponsiveVariant; // ✨ 수정된 부분
} & Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className' | 'variant'>; // Omit에 'variant' 추가
/**
 * 디자인 시스템의 타이포그래피를 적용하는 다형성 컴포넌트입니다.
 *
 * @example
 * //반응형 사용
 * <Text
 * variant={{
 *   initial: 'body04', // 기본 (모바일)
 *   md: 'body03',      // 768px 이상
 *   lg: 'title04',     // 1280px 이상
 * }}
 * >
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
export function Text<T extends ElementType = 'span'>({
  as,
  variant,
  className,
  children,
  ...props
}: TextProps<T>) {
  const Component = as || 'span'; // 기본 태그는 'p'로 설정

  return (
    <Component
      
      className={twMerge(textVariants({ variant: variant as never }), className)}
      {...props}
    >
      {children}
    </Component>
  );
}


