import { Text } from '../Text';
type EmptyPlaceholderProps = {
  /**
   * 컴포넌트 내부에 표시될 메시지입니다.
   * 예: <>아직 카테고리의<br/>데이터가 없어요!</>
   */
  children: React.ReactNode;
};

/**
 * 데이터가 없을 때 표시하는 범용 플레이스홀더 컴포넌트입니다.
 */
const EmptyPlaceholder = ({ children }: EmptyPlaceholderProps) => {
  return (
    <div className="w-full self-stretch h-48 inline-flex flex-col justify-center items-center gap-5">
      {/* 아이콘 영역 */}
      <div className="w-12 h-12 p-2.5 bg-grayscale-gray5 rounded-[599.40px] inline-flex justify-center items-center gap-1.5 overflow-hidden">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17.9995 6.00012L5.99951 18.0001"
            stroke="#B0B8C1"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5.99951 6.00012L17.9995 18.0001"
            stroke="#B0B8C1"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* 텍스트 영역 (props로 받은 children 사용) */}
      <Text variant={'body04'} className="text-grayscale-gray70 ">
        {children}
      </Text>
    </div>
  );
};

export default EmptyPlaceholder;
