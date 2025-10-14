import { create } from 'zustand';

type Overview = {
  childName: string;
  grapes: number;
  emotion: number;
  emotionDone: boolean;
  specifiedDone: boolean;
};

type State = Overview & {
  setOverview: (o: Overview) => void;
  setChildName: (name: string) => void;
  setGrapes: (n: number) => void;
  setEmotion: (e: number) => void;
  setEmotionDone: (b: boolean) => void;
  setSpecifiedDone: (b: boolean) => void;
};

export const useChildStore = create<State>((set) => ({
  childName: '',
  grapes: 0,
  emotion: 0,
  emotionDone: false,
  specifiedDone: false,

  // setOverview는 HydrateChildStore에서 전체 데이터를 한 번에 주입할 때 사용됩니다.
  setOverview: (o) => set(o),

  // ✅ [추가] 각 상태를 개별적으로 업데이트할 수 있는 action 함수들을 추가/수정합니다.
  setChildName: (name) => set({ childName: name }),
  setGrapes: (n) => set({ grapes: n }),
  setEmotion: (e) => set({ emotion: e }),
  setEmotionDone: (b) => set({ emotionDone: b }),
  setSpecifiedDone: (b) => set({ specifiedDone: b }),
}));
