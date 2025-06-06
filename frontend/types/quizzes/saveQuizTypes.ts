import { Quiz } from "./createQuizTypes";

export interface SaveQuizRequest {
  quizzes: (Quiz & { quizOrder: number })[];
}

export type SaveQuizResult = {
  lectureId: string;
  savedCount: number;
  quizIds: string[];
};
