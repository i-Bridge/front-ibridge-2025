


import { Text } from "../Text";
import RotatingSpinner from "./RotatingSpinner";
type LoadingPlaceholderProps = {
  /**
   * 컴포넌트 내부에 표시될 메시지입니다.
   * 예: <>아직 카테고리의<br/>데이터가 없어요!</>
   */
  children: React.ReactNode;
};

/**
 * 데이터가 없을 때 표시하는 범용 플레이스홀더 컴포넌트입니다.
 */
const LoadingPlaceholder = ({ children }: LoadingPlaceholderProps) => {
  return (
    <div
      className="w-full self-stretch inline-flex flex-col justify-center items-center gap-5"
    >
      {/* 아이콘 영역 */}
      <RotatingSpinner/>

      {/* 텍스트 영역 (props로 받은 children 사용) */}
      <Text variant={'body04'} className="text-grayscale-gray50 ">
        {children}
      </Text>
    </div>
  );
};

export default LoadingPlaceholder;