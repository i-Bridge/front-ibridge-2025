'use client';
import { useSetupStore } from '@/store/setup/setupStore';
import Step1 from './step1';
import Step2 from './step2';

const Setup = () => {
  const { step, childrenCount, currentChildIndex } = useSetupStore();

  console.log("현재 step:", step); // ✅ 디버깅용 로그 추가

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      {step === 1 && <Step1 />}
      {step === 2 && currentChildIndex < childrenCount && <Step2 />}
    </div>
  );
};

export default Setup;
