// 선택된 subject,question 상태 관리
import { create } from "zustand";

interface SubjectState {
  selectedSubjectId: number | null;
  setSelectedSubjectId: (id: number | null) => void;
  selectedQuestionId: number | null;
  setSelectedQuestionId: (id: number | null) => void;
  showPanels: boolean;
  setShowPanels: (show: boolean) => void;
}

export const useSubjectStore = create<SubjectState>((set) => ({
  selectedSubjectId: null,
  setSelectedSubjectId: (id) => set({ selectedSubjectId: id, selectedQuestionId: null }),
  selectedQuestionId: null,
  setSelectedQuestionId: (id) => set({ selectedQuestionId: id }),
  showPanels: false,
  setShowPanels: (show) => set({ showPanels: show }),
}));
