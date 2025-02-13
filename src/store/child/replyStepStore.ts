import { create } from 'zustand';

interface ReplyStepsState {
  completedSteps: number; // 완료된 단계 수
  completeStep: () => void; // 단계 완료 함수
}

export const useReplyStepsStore = create<ReplyStepsState>((set) => ({
  completedSteps: 0,
  completeStep: () => set((state) => ({ completedSteps: state.completedSteps + 1 })),
}));


