'use client';
import { useSetupStore } from '@/store/setup/setupStore';
import Step1 from './step1';
import Step2 from './step2';

const Setup = () => {
  const { step, childrenCount, currentChildIndex } = useSetupStore();

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      {step === 1 && <Step1 />}
      {step === 2 && currentChildIndex < childrenCount && <Step2 />}
    </div>
  );
};

export default Setup;
