import axios from "axios";
import { axiosInstance } from "@/api/axiosInstance";
import { ENDPOINTS } from "@/constants/endpoints";
import { ApiResponse } from "@/types/apiResponseTypes";
import { GetHomeProfileInfoResult } from "@/types/users/getHomeProfileInfoTypes";

export async function getHomeProfileInfo() {
  try {
    const response = await axiosInstance.get<
      ApiResponse<GetHomeProfileInfoResult>
    >(ENDPOINTS.USERS.GET_PROFILE);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<GetHomeProfileInfoResult>;
    }
    throw error;
  }
}
