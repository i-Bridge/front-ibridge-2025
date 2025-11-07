import { twMerge } from 'tailwind-merge';

type DotWavesProps = {
  /**
   * Tailwind의 'bg-*' 클래스를 전달하여 점의 색상을 변경할 수 있습니다.
   * 예: "bg-blue-500"
   */
  className?: string;
};

export const DotWaves = ({ className }: DotWavesProps) => (
  <div className="flex gap-1.5 justify-center items-center">
    <span
      className={twMerge(
        'w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]',
        className, // 여기에 "bg-blue-500" 등이 전달되면 bg-white를 덮어씁니다.
      )}
    ></span>
    <span
      className={twMerge(
        'w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]',
        className,
      )}
    ></span>
    <span
      className={twMerge(
        'w-2.5 h-2.5 bg-white rounded-full animate-bounce',
        className,
      )}
    ></span>
  </div>
);