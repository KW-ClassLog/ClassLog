import { axiosInstance } from "@/api/axiosInstance";
import axios from "axios"; // 추가
import { ENDPOINTS } from "@/constants/endpoints";
import { ApiResponse } from "@/types/apiResponseTypes";
import { VerifyEmailResult } from "@/types/users/verifyEmailTypes";
import { MyClassResult } from "@/types/classes/myClassTypes";

export async function fetchMyClassList() {
  try {
    const response = await axiosInstance.get<ApiResponse<MyClassResult>>(
      ENDPOINTS.CLASSES.GET_MY_CLASSES
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<VerifyEmailResult>;
    }
    throw error;
  }
}
