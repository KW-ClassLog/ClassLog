import axios from "axios";
import { axiosInstance } from "@/api/axiosInstance";
import { ENDPOINTS } from "@/constants/endpoints";
import { ApiResponse } from "@/types/apiResponseTypes";
import { fetchQuizDetailStatResult } from "@/types/quizzes/fetchQuizDetailStatTypes";

export async function fetchQuizDetailStat(lectureId: string) {
  try {
    const response = await axiosInstance.get<
      ApiResponse<fetchQuizDetailStatResult>
    >(ENDPOINTS.QUIZZES.GET_DETAIL_STAT(lectureId));
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<fetchQuizDetailStatResult>;
    }
    throw error;
  }
}
