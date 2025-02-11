import { create } from 'zustand';
import { Question, PeriodicQuestion } from '@/types/Regular/question';

interface QuestionStore {
  dailyQuestions: Question[];
  periodicQuestions: PeriodicQuestion[];
  addDailyQuestion: (content: string) => void;
  addPeriodicQuestion: (question: Omit<PeriodicQuestion, 'id'>) => void;
}

const useQuestionStore = create<QuestionStore>((set) => ({
  dailyQuestions: [
    { id: 1, content: '오늘 기분이 어떠신가요?' },
    { id: 2, content: '오늘 가장 기억에 남는 일은 무엇인가요?' },
  ],
  periodicQuestions: [
    { id: 1, content: '이번 주 목표는 무엇인가요?', period: '매주' },
    {
      id: 2,
      content: '한 달 동안 가장 큰 변화는 무엇이었나요?',
      period: '매월',
    },
  ],
  addDailyQuestion: (content) =>
    set((state) => ({
      dailyQuestions: [
        ...state.dailyQuestions,
        { id: state.dailyQuestions.length + 1, content },
      ],
    })),
  addPeriodicQuestion: (question) =>
    set((state) => ({
      periodicQuestions: [
        ...state.periodicQuestions,
        {
          id: state.periodicQuestions.length + 1,
          ...question,
        },
      ],
    })),
}));

export default useQuestionStore;
