import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";
import { refreshToken } from "@/api/users/refreshToken";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

// 토큰이 필요하지 않은 API들 (로그인, 로그아웃, 회원가입, 이메일 인증)
const noTokenRequired = [
  "/users/login",
  "/users/logout",
  "/users/signup",
  "/users/verify-email",
];

// 모든 요청에 useAuthStore에서 accessToken을 가져와 Authorization 헤더로 첨부
axiosInstance.interceptors.request.use((config) => {
  const isNoTokenRequired = noTokenRequired.some((endpoint) =>
    config.url?.includes(endpoint)
  );

  // 토큰이 필요한 API가 아닌 경우에만 Authorization 헤더 추가
  if (!isNoTokenRequired) {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const authStore = useAuthStore.getState();

    const isNoTokenRequired = noTokenRequired.some((endpoint) =>
      originalRequest.url?.includes(endpoint)
    );

    // accessToken 만료로 401이 발생한 경우 (토큰이 필요한 API에서만)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry && // 무한 루프 방지
      !isNoTokenRequired // 토큰이 필요하지 않은 API는 제외
    ) {
      originalRequest._retry = true;
      try {
        await refreshToken();
      } catch (refreshError) {
        console.error("토큰 갱신 실패:", refreshError);
        authStore.logout(); // 실패 시 로그아웃
      }
    }

    return Promise.reject(error);
  }
);
