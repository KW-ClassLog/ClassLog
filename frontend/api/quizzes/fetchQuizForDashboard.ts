import axios from "axios";
import { axiosInstance } from "@/api/axiosInstance";
import { ENDPOINTS } from "@/constants/endpoints";
import { ApiResponse } from "@/types/apiResponseTypes";
import { fetchQuizForDashboardResult } from "@/types/quizzes/fetchQuizForDashboardTypes";

export async function fetchQuizForDashboard(lectureId: string) {
  try {
    const response = await axiosInstance.get<
      ApiResponse<fetchQuizForDashboardResult>
    >(ENDPOINTS.QUIZZES.GET_FOR_DASHBOARD(lectureId));
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<fetchQuizForDashboardResult>;
    }
    throw error;
  }
}
