import ChildHeaderLayout, {
  ChildName,
  GrapeInfo,
} from '@/app/child/[childId]/_components/header/ChildHeader';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* Header.ChildName 대신 ChildName 컴포넌트를 직접 사용합니다. */}
      <ChildHeaderLayout
        className="bg-white"
        left={<ChildName />}
        right={<GrapeInfo />}
      />

      <main className="">{children}</main>
    </div>
  );
}
