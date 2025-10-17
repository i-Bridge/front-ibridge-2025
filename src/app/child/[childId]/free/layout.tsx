import Header, { CloseIcon } from '../_components/Header';

export default function FreeTalkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header
        center={<h1 className="text-lg font-bold">자유토크</h1>}
        right={
          <button aria-label="닫기">
            <CloseIcon />
          </button>
        }
      />
      <main>{children}</main>
    </div>
  );
}
