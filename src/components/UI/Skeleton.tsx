/**
 * Tailwind CSS를 사용하는 기본 스켈레톤 UI 컴포넌트
 * (반짝이는 효과 포함, 서버 컴포넌트)
 * @param className - 추가적인 스타일링을 위한 클래스 이름
 */
export default function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-md bg-gray-200 ${className}`}
    >
      <div className="shimmer absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-gray-50/50 to-transparent"></div>
    </div>
  );
}
