import axios from "axios";
import { axiosInstance } from "@/api/axiosInstance";
import { ENDPOINTS } from "@/constants/endpoints";
import { ApiResponse } from "@/types/apiResponseTypes";
import { fetchQuizSubmitListResult } from "@/types/quizzes/fetchSubmitListTypes";

export async function fetchSubmitList(lectureId: string) {
  try {
    const response = await axiosInstance.get<
      ApiResponse<fetchQuizSubmitListResult>
    >(ENDPOINTS.QUIZZES.GET_SUBMIT_LIST(lectureId));
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<fetchQuizSubmitListResult>;
    }
    throw error;
  }
}
