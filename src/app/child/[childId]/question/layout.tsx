

// ✅ [수정] 더 이상 클라이언트 훅이 필요 없으므로, 가벼운 서버 컴포넌트로 되돌립니다.
export default function QuestionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>

      <main>{children}</main>
    </div>
  );
}
