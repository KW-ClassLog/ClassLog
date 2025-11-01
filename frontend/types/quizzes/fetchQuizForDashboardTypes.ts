export interface fetchQuizForDashboardResult {
  totalQuizCount: number;
  averageCorrectRate: number;
  quizList: Quiz[];
}

type Quiz =
  | {
      quizId: string;
      quizOrder: number;
      type: "multipleChoice";
      quizBody: string;
      correctRate: number;
      solution: string;
      options: Array<{ optionOrder: number; option: string; count: number }>;
    }
  | {
      quizId: string;
      quizOrder: number;
      type: "trueFalse";
      quizBody: string;
      correctRate: number;
      solution: string;
      options: Array<{ optionOrder: null; option: string; count: number }>;
    }
  | {
      quizId: string;
      quizOrder: number;
      type: "shortAnswer";
      quizBody: string;
      correctRate: number;
      solution: string;
      count: number;
    };
