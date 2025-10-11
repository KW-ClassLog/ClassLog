import axios from "axios";
import { axiosInstance } from "@/api/axiosInstance";
import { ENDPOINTS } from "@/constants/endpoints";
import { ApiResponse } from "@/types/apiResponseTypes";
import { getMyQuizResultResult } from "@/types/quizzes/getMyQuizResultTypes";

export async function getMyQuizResult(lectureId: string) {
  try {
    const response = await axiosInstance.get<
      ApiResponse<getMyQuizResultResult>
    >(ENDPOINTS.QUIZZES.GET_RESULT(lectureId));
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<getMyQuizResultResult>;
    }
    throw error;
  }
}
