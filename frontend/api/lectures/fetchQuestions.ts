import { axiosInstance } from "@/api/axiosInstance";
import axios from "axios";
import { ENDPOINTS } from "@/constants/endpoints";
import { ApiResponse } from "@/types/apiResponseTypes";
import { FetchQuestionsResult } from "@/types/lectures/fetchQuestionsTypes";

export async function fetchQuestions(lectureId: string) {
  try {
    const response = await axiosInstance.get<
      ApiResponse<FetchQuestionsResult>
    >(ENDPOINTS.LECTURES.GET_CHAT(lectureId));
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<FetchQuestionsResult>;
    }
    throw error;
  }
}
