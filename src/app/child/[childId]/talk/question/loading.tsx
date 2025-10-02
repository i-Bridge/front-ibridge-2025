import Skeleton from '@/components/UI/Skeleton'; // 반짝이는 효과가 적용된 Skeleton 컴포넌트 경로

export default function QuestionLoading() {
  return (
    // [전체 레이아웃] TalkSession의 루트 div와 동일한 구조를 유지합니다.
    <div className="flex items-center justify-center h-screen relative p-6 bg-i-skyblue overflow-hidden">
      {/* [캐릭터 스켈레톤] 실제 캐릭터 이미지의 크기와 위치를 반영합니다. */}

      <div className="relative bottom-[-50px]">
        <Skeleton className="w-[500px] h-[500px] rounded-full" />
      </div>
      {/* [말풍선 스켈레톤] 실제 말풍선의 크기와 위치를 반영합니다. */}
      <div className="relative w-full max-w-[460px] min-w-[280px] h-[280px] -top-32 ml-8 flex-shrink-0">
        <Skeleton className="w-full h-full rounded-3xl" />
      </div>
      {/* [VideoRecorder 패널 스켈레톤] 우측 패널의 위치를 잡습니다. */}
      <div className="ml-32 flex flex-col gap-8 text-center">
        {/* [VideoRecorder 내부 스켈레톤] 실제 VideoRecorder의 배경과 내부 요소들을 모방합니다. */}

        <div
          className="flex flex-col items-center min-w-[300px] max-w-[400px] gap-4 p-10 pr-14 bg-contain bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/images/영상박스_점선.png')`,
          }}
        >
          {/* 비디오 화면 스켈레톤 */}
          <Skeleton className="w-80 h-60 rounded-lg shadow-sm mt-4" />
          {/* 텍스트 안내 박스 스켈레톤 */}
          <Skeleton className="w-80 h-10 rounded-lg shadow-sm" />
          {/* 녹화 버튼 스켈레톤 */}
          <Skeleton className="w-16 h-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}
