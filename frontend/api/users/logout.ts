import { axiosInstance } from "@/api/axiosInstance";
import axios from "axios";
import { ENDPOINTS } from "@/constants/endpoints";
import { ApiResponse } from "@/types/apiResponseTypes";
import { useAuthStore } from "@/store/useAuthStore";

export async function logout() {
  try {
    const response = await axiosInstance.post<ApiResponse<string>>(
      ENDPOINTS.USERS.LOGOUT
    );

    useAuthStore.getState().logout();
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<string>;
    }
    throw error;
  }
}
