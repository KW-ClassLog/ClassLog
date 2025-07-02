import { axiosInstance } from "@/api/axiosInstance";
import axios from "axios";
import { ENDPOINTS } from "@/constants/endpoints";
import { ApiResponse } from "@/types/apiResponseTypes";
import { FetchEntryCodeResult } from "@/types/classes/fetchEntryCodeTypes";

export async function fetchEntryCode(classId: string) {
  try {
    const response = await axiosInstance.get<
      ApiResponse<FetchEntryCodeResult | null>
    >(ENDPOINTS.CLASSES.GET_ENTRY_CODE(classId));
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<FetchEntryCodeResult | null>;
    }
    throw error;
  }
}
