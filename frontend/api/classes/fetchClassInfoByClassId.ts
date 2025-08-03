import { axiosInstance } from "@/api/axiosInstance";
import axios from "axios";
import { ENDPOINTS } from "@/constants/endpoints";
import { ApiResponse } from "@/types/apiResponseTypes";
import { FetchClassInfoByClassIdResult } from "@/types/classes/fetchClassInfoByClassIdTypes";

export async function fetchClassInfoByClassId(classId: string) {
  try {
    const response = await axiosInstance.get<
      ApiResponse<FetchClassInfoByClassIdResult>
    >(ENDPOINTS.CLASSES.GET_DETAIL(classId));
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<FetchClassInfoByClassIdResult>;
    }
    throw error;
  }
}
