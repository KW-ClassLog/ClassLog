import axios from "axios";
import { axiosInstance } from "@/api/axiosInstance";
import { ENDPOINTS } from "@/constants/endpoints";
import { ApiResponse } from "@/types/apiResponseTypes";
import { Quiz } from "@/types/quizzes/createQuizTypes";
import { SaveQuizRequest, SaveQuizResult } from "@/types/quizzes/saveQuizTypes";

export async function saveQuiz(lectureId: string, quizzes: Quiz[]) {
  try {
    const quizzesWithOrder = quizzes.map((quiz, idx) => ({
      ...quiz,
      quizOrder: idx + 1,
    }));
    console.log({ quizzes: quizzesWithOrder });

    const response = await axiosInstance.post<ApiResponse<SaveQuizRequest>>(
      ENDPOINTS.QUIZZES.SAVE(lectureId),
      { quizzes: quizzesWithOrder }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<SaveQuizResult>;
    }
    throw error;
  }
}
