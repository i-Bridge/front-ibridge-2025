import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge'; // tailwind-merge import

interface ParentLayoutProps {
  title: ReactNode;
  children: ReactNode;
  /**
   * 레이아웃의 최상위 컨테이너(div)에 추가할 Tailwind CSS 클래스입니다.
   * 너비, flex 방향 등 기본 스타일을 덮어쓸 수 있습니다.
   */
  containerClassName?: string; 
}

/**
 * 페이지의 공통적인 레이아웃을 정의하는 컴포넌트입니다.
 * h1 타이틀과 메인 컨텐츠 영역을 포함합니다.
 * @param {ReactNode} title - 페이지의 제목으로 렌더링될 요소입니다.
 * @param {ReactNode} children - 페이지의 메인 컨텐츠입니다.
 * @param {string} containerClassName - 최상위 컨테이너에 적용할 사용자 정의 클래스입니다.
 */
export default function ParentLayout({ title, children, containerClassName }: ParentLayoutProps) {
  // [수정] twMerge를 사용하여 기본 클래스와 사용자 정의 클래스를 병합합니다.
  const baseClasses = 'w-full flex flex-col lg:max-w-[1200px] lg:min-w-[960px]';
  const mergedClasses = twMerge(baseClasses, containerClassName);

  return (
    // [적용] 병합된 클래스를 최상위 div에 적용합니다.
    <div className={mergedClasses}> 
      {/* title prop으로 받은 내용을 여기에 렌더링합니다. */}
      <header className="self-stretch px-5 pt-5 md:px-10 md:pt-14 md:pb-5 inline-flex flex-col justify-start items-start gap-3">
        {title}
      </header>

      {/* children prop으로 받은 내용을 여기에 렌더링합니다. */}
      <main className="flex-1 w-full self-stretch p-5 md:px-10 md:py-5 inline-flex flex-col justify-center items-start gap-5">
        {children}
      </main>
    </div>
  );
}