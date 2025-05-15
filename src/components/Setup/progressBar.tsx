'use client';
import { useSetupStore } from '@/store/setup/setupStore';

const ProgressBar = () => {
  const { currentChildIndex, childrenCount, step } = useSetupStore();

  // ✅ 전체 단계 수: step1(1) + step2(자식 수)
  const totalSteps = childrenCount;
  const progress = ((currentChildIndex ) / totalSteps) * 100;

  if (step === 1) {
    return (
      <div>
        <h1 className="text-black text-sm text-center mb-2">
          가족 등록
        </h1>
        <div className="w-full bg-gray-300 h-2 rounded-full ">
          <div
            className="h-full bg-green-200 transition-all"
            style={{ width: `100%` }}
          ></div>
        </div>
      </div>
    );
  }
  if (step === 2) {
    return (
      <div>
        
        <h1 className="text-black text-sm text-center mb-2">
        
          자녀 등록({currentChildIndex }/{childrenCount})
        </h1>
        <div className="w-full bg-gray-300 h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    );
  }
};

export default ProgressBar;
