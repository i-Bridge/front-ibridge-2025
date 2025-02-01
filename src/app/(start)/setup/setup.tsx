// src/app/setup/setup.tsx
// 단계관리, 프로그레스 바 업데이트
'use client';
import React from 'react';
import { useSetupStore } from '@/store/setup/setupStore';
import Step1 from './step1';
import Step2 from './step2';
import Step3 from './step3';

const Setup = () => {
  const { step } = useSetupStore();

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      {step === 1 && <Step1 />}
      {step === 2 && <Step2 />}
      {step === 3 && <Step3 />}
    </div>
  );
};

export default Setup;
