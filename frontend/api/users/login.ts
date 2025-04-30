import axios from "axios";
import { axiosInstance } from "@/api/axiosInstance";
import { ENDPOINTS } from "@/constants/endpoints";
import { ApiResponse } from "@/types/apiResponseTypes";
import { LoginRequest, LoginResult } from "@/types/users/loginTypes";

// 로그인 후 응답 타입에 accessToken 추가
export interface LoginApiResponse extends ApiResponse<LoginResult> {
  accessToken?: string; // accessToken을 별도로 반환
}

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
      ...response.data, // 기존 응답 데이터
      accessToken, // 추가된 accessToken
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as LoginApiResponse;
    }
    throw error;
  }
}
