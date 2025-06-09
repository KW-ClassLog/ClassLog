import axios from "axios";
import { axiosInstance } from "@/api/axiosInstance";
import { ENDPOINTS } from "@/constants/endpoints";
import { ApiResponse } from "@/types/apiResponseTypes";
import {
  CreateQuizRequest,
  CreateQuizResult,
} from "@/types/quizzes/createQuizTypes";

export async function recreateQuiz({ lectureId, useAudio }: CreateQuizRequest) {
  try {
    const response = await axiosInstance.post<
      ApiResponse<CreateQuizResult | null>
    >(ENDPOINTS.QUIZZES.RECREATE(lectureId), { useAudio });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<CreateQuizResult | null>;
    }
    throw error;
  }
}
