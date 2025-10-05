'use client';
import { useSetupStore } from '@/store/useSetupStore';
import Step0_agreement from './Step0_agreement';
import Step1_family from './Step1_family';
import Step2_child from './Step2_child';

const Setup = () => {
  const { step, childrenCount, currentChildIndex } = useSetupStore();

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      {step === 0 && <Step0_agreement />}
      {step === 1 && <Step1_family />}
      {step === 2 && currentChildIndex < childrenCount && <Step2_child />}
    </div>
  );
};

export default Setup;
