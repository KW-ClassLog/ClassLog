import axios from "axios";
import { axiosInstance } from "@/api/axiosInstance";
import { ENDPOINTS } from "@/constants/endpoints";
import { ApiResponse } from "@/types/apiResponseTypes";
import { useAuthStore } from "@/store/useAuthStore";

export async function refreshToken() {
  try {
    const response = await axiosInstance.post<ApiResponse<string | null>>(
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
    } else {
      // accessToken이 없으면 logout() 호출
      useAuthStore.getState().logout();
    }

    return response.data;
  } catch (error: unknown) {
    if (
      axios.isAxiosError(error) &&
      (error.response?.status === 401 || error.response?.status === 403)
    ) {
      useAuthStore.getState().logout(); // 갱신 실패 (401 또는 403) 시 logout() 호출
    }
    throw error;
  }
}
