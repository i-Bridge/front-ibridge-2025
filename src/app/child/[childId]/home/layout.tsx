import Header, {
  ChildName,
  GrapeInfo,
} from '../_components/header/ChildHeader';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* Header.ChildName 대신 ChildName 컴포넌트를 직접 사용합니다. */}
      <Header left={<ChildName />} right={<GrapeInfo />} />
      <main className="pt-16">{children}</main>
    </div>
  );
}
