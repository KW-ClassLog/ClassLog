import { create } from "zustand";
import { Quiz } from "@/types/quizzes/createQuizTypes";

interface QuizState {
  // lectureId별 퀴즈 데이터
  quizzesByLecture: Record<string, Quiz[] | null>;
  selectedQuizzes: Quiz[];
  error: string | null;

  // 로딩 상태
  isLoading: boolean;
  isLoadingMore: boolean;

  // 액션들
  setQuizzes: (lectureId: string, quizzes: Quiz[] | null) => void;
  getQuizzes: (lectureId: string) => Quiz[] | null;
  setSelectedQuizzes: (selectedQuizzes: Quiz[]) => void;
  addQuizzes: (lectureId: string, newQuizzes: Quiz[]) => void;
  toggleQuizSelection: (quiz: Quiz) => void;
  clearSelection: () => void;
  setError: (error: string | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsLoadingMore: (isLoadingMore: boolean) => void;

  // 특정 lectureId의 퀴즈만 리셋
  resetLectureQuizzes: (lectureId: string) => void;
  // 전체 초기화
  reset: () => void;
}

const initialState = {
  quizzesByLecture: {},
  selectedQuizzes: [],
  error: null,
  isLoading: false,
  isLoadingMore: false,
};

export const useQuizStore = create<QuizState>((set, get) => ({
  ...initialState,

  setQuizzes: (lectureId, quizzes) => {
    set((state) => ({
      quizzesByLecture: {
        ...state.quizzesByLecture,
        [lectureId]: quizzes,
      },
    }));
  },

  getQuizzes: (lectureId) => {
    const { quizzesByLecture } = get();
    return quizzesByLecture[lectureId] || null;
  },

  setSelectedQuizzes: (selectedQuizzes) => set({ selectedQuizzes }),

  addQuizzes: (lectureId, newQuizzes) => {
    const { quizzesByLecture } = get();
    const currentQuizzes = quizzesByLecture[lectureId];

    if (currentQuizzes) {
      set((state) => ({
        quizzesByLecture: {
          ...state.quizzesByLecture,
          [lectureId]: [...currentQuizzes, ...newQuizzes],
        },
      }));
    } else {
      set((state) => ({
        quizzesByLecture: {
          ...state.quizzesByLecture,
          [lectureId]: newQuizzes,
        },
      }));
    }
  },

  toggleQuizSelection: (quiz) => {
    const { selectedQuizzes } = get();
    const exists = selectedQuizzes.some((q) => q === quiz);

    if (exists) {
      set({ selectedQuizzes: selectedQuizzes.filter((q) => q !== quiz) });
    } else {
      if (selectedQuizzes.length >= 4) {
        // 최대 4개 선택 제한은 UI에서 처리
        return;
      }
      set({ selectedQuizzes: [...selectedQuizzes, quiz] });
    }
  },

  clearSelection: () => set({ selectedQuizzes: [] }),

  setError: (error) => set({ error }),

  setIsLoading: (isLoading) => set({ isLoading }),

  setIsLoadingMore: (isLoadingMore) => set({ isLoadingMore }),

  resetLectureQuizzes: (lectureId) => {
    set((state) => {
      const newQuizzesByLecture = { ...state.quizzesByLecture };
      delete newQuizzesByLecture[lectureId];
      return {
        quizzesByLecture: newQuizzesByLecture,
        selectedQuizzes: [],
        error: null,
        isLoading: false,
        isLoadingMore: false,
      };
    });
  },

  reset: () => set(initialState),
}));
