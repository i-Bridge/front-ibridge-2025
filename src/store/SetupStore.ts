// store/setupStore.ts (Zustand 스토어 - 단계 관리)
import { create } from 'zustand';

interface SetupState {
  step: number;
  nextStep: () => void;
  prevStep: () => void;
}

export const useSetupStore = create<SetupState>((set) => ({
  step: 1,
  nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 3) })),
  prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 1) })),
}));