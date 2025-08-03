import axios from "axios";
import { axiosInstance } from "@/api/axiosInstance";
import { ENDPOINTS } from "@/constants/endpoints";
import { ApiResponse } from "@/types/apiResponseTypes";
import { UpdateLectureInfoRequest } from "@/types/lectures/updateLectureInfoTypes";

export async function updateLectureInfo({
  lectureId,
  data,
}: UpdateLectureInfoRequest) {
  try {
    const response = await axiosInstance.patch<ApiResponse<void>>(
      ENDPOINTS.LECTURES.UPDATE(lectureId),
      data
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<void>;
    }
    throw error;
  }
}
