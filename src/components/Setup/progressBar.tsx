'use client';
import { useSetupStore } from '@/store/setup/setupStore';

const ProgressBar = () => {
  const { currentChildIndex, childrenCount, step } = useSetupStore();

  // ✅ 전체 단계 수: step1(1) + step2(자식 수)
  const totalSteps = childrenCount;
  const progress = ((currentChildIndex +1) / totalSteps) * 100;

  if (step === 1) {
    return (
      <div>
        <h1 className="text-gray-900 text-md text-center mb-2 font-semibold">
          가족 등록
        </h1>
        <div className="w-full h-2 ">
         
        </div>
      </div>
    );
  }
  if (step === 2) {
    return (
      <div>
        
        <h1 className="text-gray-900 text-md text-center mb-2 font-semibold">
        
          자녀 등록({currentChildIndex +1 }/{childrenCount})
        </h1>
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden ">
          <div
            className="h-full bg-i-lightgreen transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    );
  }
};

export default ProgressBar;
