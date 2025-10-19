import axios from "axios";
import { axiosInstance } from "@/api/axiosInstance";
import { ENDPOINTS } from "@/constants/endpoints";
import { ApiResponse } from "@/types/apiResponseTypes";

export async function saveChatting( lectureId: string ) {
  try {
    const response = await axiosInstance.post<ApiResponse<null>>(
      ENDPOINTS.LECTURES.SAVE_CHAT(lectureId)
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<null>;
    }
    throw error;
  }
}