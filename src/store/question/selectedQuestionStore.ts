// src/store/QuestionStore.ts
// 선택된 질문 상태 관리

import { create } from "zustand";

interface QuestionState {
  selectedQuestions: Set<number>; // 선택된 질문들의 상태를 Set으로 관리 (중복 방지)
  toggleQuestion: (question: number) => void; // 질문의 상태를 토글하는 함수 (보이기/숨기기)
  resetQuestions: () => void; // 날짜를 변경할 때 상태 초기화
}

export const useQuestionStore = create<QuestionState>((set) => ({
  selectedQuestions: new Set<number>(), 
  toggleQuestion: (question) =>
    set((state) => {
      const newSelectedQuestions = new Set(state.selectedQuestions);
      if (newSelectedQuestions.has(question)) {
        newSelectedQuestions.delete(question); // 질문이 이미 있으면 제거
      } else {
        newSelectedQuestions.add(question); // 질문이 없으면 추가
      }
      return { selectedQuestions: newSelectedQuestions };
    }),
  resetQuestions: () => set({ selectedQuestions: new Set() }), // 상태 초기화
}));
