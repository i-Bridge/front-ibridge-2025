import type { ReactNode } from 'react';

interface PageLayoutProps {
  title: ReactNode;
  children: ReactNode;
}

/**
 * 페이지의 공통적인 레이아웃을 정의하는 컴포넌트입니다.
 * h1 타이틀과 메인 컨텐츠 영역을 포함합니다.
 * @param {ReactNode} title - 페이지의 제목으로 렌더링될 요소입니다. 문자열이나 복잡한 JSX가 될 수 있습니다.
 * @param {ReactNode} children - 페이지의 메인 컨텐츠입니다.
 */
export default function PageLayout({ title, children }: PageLayoutProps) {
  return (
    // 요청하신 공통 컨테이너 div 입니다.
    <div className='w-full flex flex-col'>
      {/* title prop으로 받은 내용을 여기에 렌더링합니다. 
        이렇게 하면 페이지마다 다른 제목을 보여줄 수 있습니다.
      */}
      <header>
        {title}
      </header>

      {/* children prop으로 받은 내용을 여기에 렌더링합니다.
        이 부분이 페이지의 실제 컨텐츠가 됩니다.
      */}
      <main className="flex-1 w-full self-stretch px-10 py-5 inline-flex flex-col justify-start items-start gap-5">
        {children}
      </main>
    </div>
  );
}