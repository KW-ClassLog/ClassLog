import axios from "axios";
import { axiosInstance } from "@/api/axiosInstance";
import { ENDPOINTS } from "@/constants/endpoints";
import { ApiResponse } from "@/types/apiResponseTypes";
import { fetchQuizListResult } from "@/types/quizzes/fetchQuizListTypes";

export async function fetchQuizList(lectureId: string) {
  try {
    const response = await axiosInstance.get<ApiResponse<fetchQuizListResult>>(
      ENDPOINTS.QUIZZES.GET(lectureId)
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<fetchQuizListResult>;
    }
    throw error;
  }
}
