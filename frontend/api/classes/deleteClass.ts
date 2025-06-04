import { axiosInstance } from "@/api/axiosInstance";
import axios from "axios";
import { ENDPOINTS } from "@/constants/endpoints";
import { ApiResponse } from "@/types/apiResponseTypes";

export async function deleteClass(classId: string) {
  try {
    const response = await axiosInstance.delete<ApiResponse<void>>(
      ENDPOINTS.CLASSES.DELETE(classId)
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<string | null>;
    }
    throw error;
  }
}
