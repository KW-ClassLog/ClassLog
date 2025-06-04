import { axiosInstance } from "@/api/axiosInstance";
import axios from "axios";
import { ENDPOINTS } from "@/constants/endpoints";
import { ApiResponse } from "@/types/apiResponseTypes";
import { FetchLecturesByClassResult } from "@/types/classes/fetchLecturesByClassTypes";

export async function fetchLecturesByClass(classId: string) {
  try {
    const response = await axiosInstance.get<
      ApiResponse<FetchLecturesByClassResult[]>
    >(ENDPOINTS.CLASSES.GET_LECTURES(classId));
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<FetchLecturesByClassResult[]>;
    }
    throw error;
  }
}
