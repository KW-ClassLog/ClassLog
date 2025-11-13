export type fetchQuizDetailStatResult = QuizDetailStat[];

export type QuizDetailStat =
  | MultipleChoiceQuizDetail
  | TrueFalseQuizDetail
  | ShortAnswerQuizDetail;

export interface MultipleChoiceQuizDetail {
  quizId: string;
  quizOrder: number;
  type: "multipleChoice";
  "1": number;
  "2": number;
  "3": number;
  "4": number;
}

export interface TrueFalseQuizDetail {
  quizId: string;
  quizOrder: number;
  type: "trueFalse";
  O: number;
  X: number;
}

export interface ShortAnswerQuizDetail {
  quizId: string;
  quizOrder: number;
  type: "shortAnswer";
  top3Answers: Array<{
    answer: string;
    rate: number;
  }>;
  etcAnswers: string[];
}

export interface FetchQuizDetailStatResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    result: fetchQuizDetailStatResult;
  };
}
