import axios from "axios";
import { axiosInstance } from "@/api/axiosInstance";
import { ENDPOINTS } from "@/constants/endpoints";
import { ApiResponse } from "@/types/apiResponseTypes";
import { LoginRequest, LoginResult } from "@/types/users/loginTypes";
import { useAuthStore } from "@/store/useAuthStore";

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
    const setAccessToken = useAuthStore.getState().setAccessToken;
    if (accessToken) {
      setAccessToken(accessToken);
    }

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<LoginResult>;
    }
    throw error;
  }
}
