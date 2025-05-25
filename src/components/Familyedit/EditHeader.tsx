import Link from 'next/link';

type HeaderProps = {
  childId: string;
};

export default function EditPageHeader({ childId }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white bg-opacity-95 z-50 shadow-sm h-14">
      <nav className="max-w-7xl mx-auto px-8 py-1 h-full flex items-center">
        <Link href={`/parent/${childId}/home`}>
          <img
            src="/images/logo.svg"
            alt="Logo"
            className="w-24 h-auto transition-transform duration-300 hover:scale-105"
          />
        </Link>
      </nav>
    </header>
  );
}
