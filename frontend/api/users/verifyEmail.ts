import { axiosInstance } from "@/api/axiosInstance";
import axios from "axios"; // 추가
import { ENDPOINTS } from "@/constants/endpoints";
import { ApiResponse } from "@/types/apiResponseTypes";
import {
  VerifyEmailRequest,
  VerifyEmailResult,
} from "@/types/users/verifyEmailTypes";

export async function verifyEmail({ email }: VerifyEmailRequest) {
  try {
    const response = await axiosInstance.post<ApiResponse<VerifyEmailResult>>(
      ENDPOINTS.USERS.VERIFY_EMAIL,
      { email }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<VerifyEmailResult>;
    }
    throw error;
  }
}
