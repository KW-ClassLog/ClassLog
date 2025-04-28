import axios from "axios";
import { toSnakeCase, toCamelCase } from "@/utils/caseConverter";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// 요청 보내기 전에 -> camelCase → snake_case
axiosInstance.interceptors.request.use((config) => {
  if (config.data) {
    config.data = toSnakeCase(config.data);
  }
  if (config.params) {
    config.params = toSnakeCase(config.params);
  }
  return config;
});

// 응답 받을 때 -> snake_case → camelCase
axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data) {
      response.data = toCamelCase(response.data);
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.data) {
      error.response.data = toCamelCase(error.response.data);
    }
    return Promise.reject(error);
  }
);
