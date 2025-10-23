import Header from '../_components/Header';

// ✅ [수정] 더 이상 클라이언트 훅이 필요 없으므로, 가벼운 서버 컴포넌트로 되돌립니다.
export default function QuestionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header
        center={<h1 className="text-lg font-bold">토크</h1>}
        // ✅ [수정] 모든 버튼 로직을 TalkSession으로 위임하고, 헤더에서는 제거합니다.
        right={null}
      />
      <main>{children}</main>
    </div>
  );
}
