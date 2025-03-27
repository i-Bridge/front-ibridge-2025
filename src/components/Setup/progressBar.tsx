'use client';
import { useSetupStore } from '@/store/setup/setupStore';

const ProgressBar = () => {
  const { currentChildIndex, childrenCount } = useSetupStore();

  // ✅ 전체 단계 수: step1(1) + step2(자식 수)
  const totalSteps = childrenCount;
  const progress = ((currentChildIndex + 1) / totalSteps) * 100;

  return (
    <div className="w-full bg-gray-300 h-2 rounded-full overflow-hidden">
      <div
        className="h-full bg-blue-500 transition-all"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
