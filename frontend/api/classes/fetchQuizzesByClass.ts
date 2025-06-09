import { axiosInstance } from "@/api/axiosInstance";
import axios from "axios";
import { ENDPOINTS } from "@/constants/endpoints";
import { ApiResponse } from "@/types/apiResponseTypes";
import { FetchQuizzesByClassResult } from "@/types/classes/fetchQuizzesByClassTypes";

export async function fetchQuizzesByClass(classId: string) {
  try {
    const response = await axiosInstance.get<
      ApiResponse<FetchQuizzesByClassResult[] | null>
    >(ENDPOINTS.CLASSES.GET_QUIZZES(classId));
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<
        FetchQuizzesByClassResult[] | null
      >;
    }
    throw error;
  }
}
