import { axiosInstance } from "@/api/axiosInstance";
import axios from "axios"; // 추가
import { ENDPOINTS } from "@/constants/endpoints";
import { ApiResponse } from "@/types/apiResponseTypes";
import { FetchLectureDetailResult } from "@/types/lectures/fetchLectureDetailTypes";

export async function fetchLectureDetail(lectureId: string) {
  try {
    const response = await axiosInstance.get<
      ApiResponse<FetchLectureDetailResult>
    >(ENDPOINTS.LECTURES.GET_DETAIL(lectureId));
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<FetchLectureDetailResult>;
    }
    throw error;
  }
}
