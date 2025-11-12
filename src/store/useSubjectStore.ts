// 선택된 subject,question 상태 관리
import { create } from 'zustand';
import { Subject } from '@/types/subject.types'; // [NEW] Subject 타입 임포트

interface SubjectState {
  subjects: Subject[]; // [NEW] 날짜별 주제 목록
  setSubjects: (subjects: Subject[]) => void; // [NEW] 주제 목록 설정 액션
  selectedSubjectId: number | null;
  setSelectedSubjectId: (id: number | null) => void;
  showPanels: boolean;
  setShowPanels: (show: boolean) => void;
  resetSelectedSubjectState: () => void;
}

export const useSubjectStore = create<SubjectState>((set) => ({
  subjects: [], // [NEW]
  // [MODIFIED] 새 주제 목록이 설정되면, 기존 선택된 ID들을 초기화
  setSubjects: (subjects) =>
    set({
      subjects,
      selectedSubjectId: null,
    }),
  selectedSubjectId: null,
  setSelectedSubjectId: (id) => set({ selectedSubjectId: id }),
  showPanels: false,
  setShowPanels: (show) => set({ showPanels: show }),
  resetSelectedSubjectState: () =>
    set({ selectedSubjectId: null, showPanels: false }),
}));
