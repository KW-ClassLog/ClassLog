import { axiosInstance } from "@/api/axiosInstance";
import axios from "axios";
import { ENDPOINTS } from "@/constants/endpoints";
import { ApiResponse } from "@/types/apiResponseTypes";
import { FetchClassNameByLectureIdResult } from "@/types/classes/fetchClassNameByLectureIdTypes";

export async function fetchClassNameByLectureId(lectureId: string) {
  try {
    const response = await axiosInstance.get<
      ApiResponse<FetchClassNameByLectureIdResult>
    >(ENDPOINTS.LECTURES.GET_CLASS_NAME(lectureId));
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response
        .data as ApiResponse<FetchClassNameByLectureIdResult>;
    }
    throw error;
  }
}
