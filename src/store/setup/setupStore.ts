// store/setup/setupStore.ts

import { create } from 'zustand';

interface ChildInfo {
  name: string;
  gender: number;
  birth: string;
}

interface SetupState {
  step: number;
  familyName: string;
  childrenCount: number;
  currentChildIndex: number;
  childrenInfo: ChildInfo[];

  setStep: (step: number) => void;
  setFamilyName: (name: string) => void;
  setChildrenCount: (count: number) => void;
  setCurrentChildIndex: (index: number) => void;
  updateChildInfo: (index: number, info: ChildInfo) => void;
  nextChild: () => void;
  resetSetupStore: () => void;
}

export const useSetupStore = create<SetupState>((set) => ({
  step: 1,
  familyName: '',
  childrenCount: 0,
  currentChildIndex: 0,
  childrenInfo: [],

  setStep: (step) => set({ step }),
  setFamilyName: (name) => set({ familyName: name }),
  setChildrenCount: (count) => set({
    childrenCount: count,
    currentChildIndex: 0,
    childrenInfo: Array.from({ length: count }, () => ({ name: '', gender: 0, birth: '' })),
  }),
  setCurrentChildIndex: (index) => set({ currentChildIndex: index }),

  updateChildInfo: (index, info) =>
    set((state) => {
      const updated = [...state.childrenInfo];
      updated[index] = info;
      return { childrenInfo: updated };
    }),

  nextChild: () =>
    set((state) => {
      if (state.currentChildIndex + 1 >= state.childrenCount) {
        return { step: 3 };
      }
      return { currentChildIndex: state.currentChildIndex + 1 };
    }),

  resetSetupStore: () =>
    set({
      step: 1,
      familyName: '',
      childrenCount: 0,
      currentChildIndex: 0,
      childrenInfo: [],
    }),
}));
