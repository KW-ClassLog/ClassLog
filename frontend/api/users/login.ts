import axios from "axios";
import { axiosInstance } from "@/api/axiosInstance";
import { ENDPOINTS } from "@/constants/endpoints";
import { ApiResponse } from "@/types/apiResponseTypes";
import { LoginRequest, LoginResult } from "@/types/users/loginTypes";

export async function login({ email, password }: LoginRequest) {
  try {
    const response = await axiosInstance.post<ApiResponse<LoginResult>>(
      ENDPOINTS.USERS.LOGIN,
      { email, password }
    );

    // 응답 헤더에서 access token 추출
    const accessToken = response.headers["authorization"]?.replace(
      "Bearer ",
      ""
    );

    return {
      ...response.data,
      accessToken, // 추가: accessToken을 함께 반환
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<LoginResult>;
    }
    throw error;
  }
}
