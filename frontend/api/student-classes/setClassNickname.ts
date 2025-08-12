import { axiosInstance } from "@/api/axiosInstance";
import axios from "axios";
import { ENDPOINTS } from "@/constants/endpoints";
import { ApiResponse } from "@/types/apiResponseTypes";

export async function setClassNickname({
  classId,
  nickname,
}: {
  classId: string;
  nickname: string;
}) {
  try {
    const response = await axiosInstance.post<ApiResponse<void>>(
      ENDPOINTS.STUDENT_CLASSES.SET_CLASS_NICKNAME,
      {
        classId,
        classNickname: nickname,
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<void>;
    }
    throw error;
  }
}
