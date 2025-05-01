import axios from "axios";
import { axiosInstance } from "@/api/axiosInstance";
import { ENDPOINTS } from "@/constants/endpoints";
import { ApiResponse } from "@/types/apiResponseTypes";
import { useAuthStore } from "@/store/useAuthStore";

export async function refreshToken() {
  try {
    const response = await axiosInstance.post<ApiResponse<string>>(
      ENDPOINTS.USERS.REFRESH_TOKEN
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

    // axios의 기본 헤더에 access token 설정
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      useAuthStore.getState().logout(); // 로그아웃 처리
      return error.response.data as ApiResponse<string>;
    }

    throw error;
  }
}
