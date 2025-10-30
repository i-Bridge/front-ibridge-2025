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
  childrenInfo: ChildInfo[];

  setStep: (step: number) => void;
  setFamilyName: (name: string) => void;
  addChild: (child: ChildInfo) => void;
  removeChild: (index: number) => void;
  updateChild: (index: number, child: ChildInfo) => void;
}

export const useSetupStore = create<SetupState>((set) => ({
  step: 0,
  familyName: '',
  childrenInfo: [],

  setStep: (step) => set({ step }),
  setFamilyName: (name) => set({ familyName: name }),
  addChild: (child) =>
    set((state) => ({
      childrenInfo: [...state.childrenInfo, child],
    })),
    removeChild: (index) =>
    set((state) => ({
      childrenInfo: state.childrenInfo.filter((_, i) => i !== index),
    })),
  updateChild: (index, child) =>
    set((state) => {
      const updatedChildren = [...state.childrenInfo];
      updatedChildren[index] = child;
      return { childrenInfo: updatedChildren };
    }),
  resetSetupStore: () =>
    set({
      step: 0,
      familyName: '',
      childrenInfo: [],
    }),
}));
