import Skeleton from '@/ui/loading/Skeleton'; // Skeleton 컴포넌트의 실제 경로로 수정해주세요.

/**
 * MailBox 페이지의 로딩 상태를 위한 스켈레톤 UI 컴포넌트
 * Figma 디자인을 기반으로 Skeleton 컴포넌트를 활용합니다.
 * (서버 컴포넌트)
 */
export default function MailBoxSkeleton() {
  return (
      <div className="self-stretch flex flex-col justify-start items-start gap-4">
        <div className="self-stretch flex flex-col justify-start items-start gap-5">
          {/*
            Figma의 각 카드 요소를 Skeleton 컴포넌트로 대체합니다.
            - self-stretch는 부모 요소가 flex-col이므로 자연스럽게 적용됩니다.
            - h-24와 p-10 (height, padding)은 Skeleton의 className으로 전달합니다.
            - bg-Grayscale-white와 outline 등은 MailType 컴포넌트에서 담당하므로,
              여기서는 Skeleton의 기본 배경과 shimmer 효과만으로 표현합니다.
              Skeleton 컴포넌트 자체가 rounded-[40px]와 bg-gray-5를 가지고 있습니다.
          */}
          <Skeleton className="h-24 p-10" />
          <Skeleton className="h-24 p-10" />
          <Skeleton className="h-24 p-10" />
          <Skeleton className="h-24 p-10" />
          <Skeleton className="h-24 p-10" />
        </div>
      </div>
  );
}
