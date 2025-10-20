import Header, { ChatHistoryIcon, CloseIcon } from '../_components/Header';

export default function QuestionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header
        center={<h1 className="text-lg font-bold">토크</h1>}
        right={
          <>
            <button aria-label="설정">
              <ChatHistoryIcon />
            </button>
            <button aria-label="닫기">
              <CloseIcon />
            </button>
          </>
        }
      />
      <main>{children}</main>
    </div>
  );
}
