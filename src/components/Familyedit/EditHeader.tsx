import Link from 'next/link';
import Image from 'next/image';

type HeaderProps = {
  childId: string;
};

export default function EditPageHeader({ childId }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white bg-opacity-95 z-50 shadow-sm h-14">
      <nav className="max-w-7xl mx-auto px-8 py-1 h-full flex items-center">
        <Link href={`/parent/${childId}/home`}>
          <Image
            src="/images/logo.svg"
            alt="Logo"
            width={96} 
            height={0} // SVG는 비율 고정이라 0으로 두고 h-auto 스타일 유지 가능
            className="h-auto"
            priority // 로고처럼 항상 보여야 하는 건 미리 로딩
          />
        </Link>
      </nav>
    </header>
  );
}
