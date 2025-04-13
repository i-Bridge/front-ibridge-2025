import { create } from 'zustand';

interface SetupState {
  step: number;
  familyName: string;
  childrenCount: number;
  currentChildIndex: number;
  setStep: (step: number) => void;
  setFamilyName: (name: string) => void;
  setChildrenCount: (count: number) => void;
  nextChild: () => void;
}

export const useSetupStore = create<SetupState>((set) => ({
  step: 1,
  familyName: '',
  childrenCount: 0,
  currentChildIndex: 0,

  setStep: (step) => set({ step }),

  setFamilyName: (name) => set({ familyName: name }),

  setChildrenCount: (count) =>
    set({ childrenCount: count, currentChildIndex: 0 }),

  nextChild: () =>
    set((state) => {
      if (state.currentChildIndex + 1 >= state.childrenCount) {
        return { step: 3 }; // 마지막 자녀까지 등록 완료 시 step 변경
      }
      return { currentChildIndex: state.currentChildIndex + 1 };
    }),
}));
