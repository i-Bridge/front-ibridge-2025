// store/useGameStore.ts
import { create } from 'zustand';

type Overview = {
  grapes: number; // 알(서버 원장 단위)
  emotionDone: boolean;
  specifiedDone: boolean;
};

type State = Overview & {
  setOverview: (o: Overview) => void;
  setGrapes: (n: number) => void;
  setEmotionDone: (b: boolean) => void;
  setSpecifiedDone: (b: boolean) => void;
};

export const useGameStore = create<State>((set) => ({
  grapes: 0,
  emotionDone: false,
  specifiedDone: false,

  setOverview: (o) => set(o),
  setGrapes: (n) => set({ grapes: n }),
  setEmotionDone: (b) => set({ emotionDone: b }),
  setSpecifiedDone: (b) => set({ specifiedDone: b }),
}));
