import { axiosInstance } from "@/api/axiosInstance";
import axios from "axios"; // 추가
import { ENDPOINTS } from "@/constants/endpoints";
import { ApiResponse } from "@/types/apiResponseTypes";
import { FetchChattingListResult } from "@/types/lectures/fetchChattingListTypes";

export async function fetchChattingList(lectureId: string) {
  try {
    const response = await axiosInstance.get<
      ApiResponse<FetchChattingListResult>
    >(ENDPOINTS.LECTURES.GET_CHATTING_LIST(lectureId));
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<FetchChattingListResult>;
    }
    throw error;
  }
}
