/**
 * Tailwind CSS를 사용하는 기본 스켈레톤 UI 컴포넌트
 * (반짝이는 효과 포함, 서버 컴포넌트)
 * @param className - 추가적인 스타일링을 위한 클래스 이름
 */
export default function Skeleton({ className }: { className?: string }) {
  return (
    <div
      // 배경을 'bg-gray-5' (단색)로 설정하고, 기본 radius를 40px로 합니다.
      className={`self-stretch relative overflow-hidden rounded-[40px] bg-grayscale-gray5 ${className}`}
    >
      {/* 반짝이는 그라데이션을 'gray-10'의 50% 투명도로 변경합니다. */}

      <div className="shimmer absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-grayscale-gray20 to-transparent"></div>
    </div>
  );
}
