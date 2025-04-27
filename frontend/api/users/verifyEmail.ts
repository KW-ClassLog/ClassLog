import axios from "axios";
import { ENDPOINTS } from "@/constants/endpoints";
import { ApiResponse } from "@/types/apiResponseTypes"; // 기존 ApiResponse
import {
  VerifyEmailRequest,
  VerifyEmailResult,
} from "@/types/users/verifyEmailTypes"; // 새로 만든 타입

export async function verifyEmail({ email }: VerifyEmailRequest) {
  try {
    const response = await axios.post<ApiResponse<VerifyEmailResult>>(
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
