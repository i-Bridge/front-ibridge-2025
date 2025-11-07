import ChildHeaderLayout, {
  ChildName,
  GrapeInfo,
  ToProfileButton,
} from '@/app/child/[childId]/_components/header/ChildHeader';
import FullscreenToggle from '../_components/header/FullscreenToggle';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen supports-[min-height:100dvh]:min-h-dvh select-none">
      {/* 2. 고정된 헤더 (상단에 고정하고 그림자 추가) */}
      {/* 💡 Sticky/Fixed 대신, Flexbox 내부에서 상단에 위치하도록 합니다. 
            만약 스크롤 시 헤더가 사라지길 원치 않는다면, `sticky top-0 z-20`을 추가하세요. */}
      <header className="flex-shrink-0 sticky top-0 z-20 ">
        <ChildHeaderLayout
          className="bg-white"
          left={
            <div className='flex gap-2'>
              <FullscreenToggle />
              <ToProfileButton/>
            </div>
          }
          center={<ChildName />}
          right={<GrapeInfo />}
        />
      </header>

      {/* 3. 메인 콘텐츠 영역 (남은 공간을 모두 채우고 스크롤 처리) */}
      <main className="flex-grow overflow-y-auto">{children}</main>
    </div>
  );
}
