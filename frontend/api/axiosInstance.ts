import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

// 모든 POST 요청에 useAuthStore에서 accessToken을 가져와 Authorization 헤더로 첨부
axiosInstance.interceptors.request.use((config) => {
  if (config.method === "post") {
    // useAuthStore는 함수이므로 직접 import해서 사용
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
  }
  return config;
});
