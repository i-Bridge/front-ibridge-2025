import { create } from 'zustand';

/**
 * 아이의 활동과 관련된 전역 상태의 데이터 구조입니다.
 */
export type ChildData = {
  /** 아이의 이름 */
  childName: string;
  /** 보유한 포도송이의 총 개수 */
  grapeBunches: number;
  /** 송이를 채우기 위해 모으고 있는 낱알 개수 (0-5) */
  grapePieces: number;
  /** 포도송이를 받을 수 있는지 여부 */
  rewardAvailable: boolean;
  /** 오늘 선택한 감정 ID */
  emotion: number;
  /** 오늘 감정 선택을 완료했는지 여부 */
  emotionDone: boolean;
  /** '오늘의 질문' 대화를 완료했는지 여부 */
  specifiedDone: boolean;
};

/**
 * 스토어의 전체 상태 타입 (데이터 + 액션)
 */
type State = ChildData & {
  isHistoryModalOpen: boolean;
  isExitModalOpen: boolean;

  /** 서버에서 받은 데이터로 스토어 전체 또는 일부를 업데이트합니다 (주로 초기화 시 사용). */
  setOverview: (overview: Partial<ChildData>) => void;

  /** '한 송이 받기' 성공 후 포도 관련 상태만 업데이트합니다. */
  setGrapeState: (grapeState: {
    grapeBunches: number;
    grapePieces: number;
    rewardAvailable: boolean;
  }) => void;

  /** 감정 선택 완료 후 상태를 업데이트합니다. */
  setEmotionDone: (isDone: boolean) => void;
  setHistoryModalOpen: (isOpen: boolean) => void;
  setExitModalOpen: (isOpen: boolean) => void;
};

export const useChildStore = create<State>((set) => ({
  // --- STATE (초기값) ---
  childName: '',
  grapeBunches: 0,
  grapePieces: 0,
  rewardAvailable: false,
  emotion: 0,
  emotionDone: false,
  specifiedDone: false,
  isHistoryModalOpen: false,
  isExitModalOpen: false,

  // --- ACTIONS ---
  setOverview: (newState) => set(newState),

  setGrapeState: (grapeState) => set(grapeState),

  setEmotionDone: (isDone) => set({ emotionDone: isDone }),
  setHistoryModalOpen: (isOpen) => set({ isHistoryModalOpen: isOpen }),
  setExitModalOpen: (isOpen) => set({ isExitModalOpen: isOpen }),
}));
