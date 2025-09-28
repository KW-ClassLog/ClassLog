import axios from "axios";
import { axiosInstance } from "@/api/axiosInstance";
import { ENDPOINTS } from "@/constants/endpoints";
import { ApiResponse } from "@/types/apiResponseTypes";
import {
  SubmitQuizRequest,
  SubmitQuizResult,
} from "@/types/quizzes/submitQuizTypes";

export async function submitQuiz(data: SubmitQuizRequest) {
  try {
    const response = await axiosInstance.post<
      ApiResponse<SubmitQuizResult | null>
    >(ENDPOINTS.QUIZZES.SUBMIT, data);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<SubmitQuizResult | null>;
    }
    throw error;
  }
}
