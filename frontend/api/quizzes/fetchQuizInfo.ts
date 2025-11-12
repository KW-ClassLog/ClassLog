import axios from "axios";
import { axiosInstance } from "@/api/axiosInstance";
import { ENDPOINTS } from "@/constants/endpoints";
import { ApiResponse } from "@/types/apiResponseTypes";
import { fetchQuizInfoResult } from "@/types/quizzes/fetchQuizInfoTypes";

export async function fetchQuizInfo(lectureId: string) {
  try {
    const response = await axiosInstance.get<ApiResponse<fetchQuizInfoResult>>(
      ENDPOINTS.QUIZZES.GET_INFO(lectureId)
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<fetchQuizInfoResult>;
    }
    throw error;
  }
}
