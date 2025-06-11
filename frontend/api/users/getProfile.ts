import axios from "axios";
import { axiosInstance } from "@/api/axiosInstance";
import { ENDPOINTS } from "@/constants/endpoints";
import { ApiResponse } from "@/types/apiResponseTypes";
import { GetProfileResult } from "@/types/users/getProfileTypes";

export async function getProfile() {
  try {
    const response = await axiosInstance.get<ApiResponse<GetProfileResult>>(
      ENDPOINTS.USERS.GET_MY_INFO
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<GetProfileResult>;
    }
    throw error;
  }
}
