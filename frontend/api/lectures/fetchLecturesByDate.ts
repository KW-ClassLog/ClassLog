import { axiosInstance } from "@/api/axiosInstance";
import axios from "axios"; // 추가
import { ENDPOINTS } from "@/constants/endpoints";
import { ApiResponse } from "@/types/apiResponseTypes";
import { FetchLecturesByDateResult } from "@/types/lectures/fetchLecturesByDate";

export async function fetchLecturesByDate(date: string) {
  try {
    const response = await axiosInstance.get<
      ApiResponse<FetchLecturesByDateResult[]>
    >(ENDPOINTS.LECTURES.GET_LECTURES_BY_DATE(date));
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<FetchLecturesByDateResult[]>;
    }
    throw error;
  }
}
