export interface CreateQuizRequest {
  lectureId: string;
  useAudio: boolean;
}

export type CreateQuizResult = {
  lectureId: string;
  quizzes: Quiz[];
};

export type Quiz = {
  quizBody: string;
  solution: string;
  options?: string[];
  type: "multipleChoice" | "shortAnswer" | "trueFalse";
};
