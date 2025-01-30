import ParentHeader from '../components/Header/ParentHeader';
import ParentFooter from '../components/Footer/ParentFooter';

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <ParentHeader />
        {children} {/* 자식 레이아웃만 렌더링 */}
        <ParentFooter />
      </body>
    </html>
  );
}
