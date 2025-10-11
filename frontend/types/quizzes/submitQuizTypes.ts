export interface SubmitQuizRequest {
  answers: Answer[];
}

type Answer = {
  quizId: string;
  answer: string;
};

export interface SubmitQuizResult {
  userId: string;
  savedCount: number;
}
